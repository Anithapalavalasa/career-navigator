import { api } from "@shared/routes";
import crypto from "crypto";
import exceljs from "exceljs";
import type { Express, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import { z } from "zod";
import { sendPasswordChangedEmail, sendPasswordResetEmail } from "./email";
import { DuplicateRegistrationError, storage } from "./storage";

// Simple hash function for passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Middleware to check admin authentication
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const adminRole = req.headers['x-admin-role'];
  const adminUsername = req.headers['x-admin-username'];

  if (!adminRole || !adminUsername || Array.isArray(adminRole) || Array.isArray(adminUsername)) {
    res.status(401).json({
      message: "Unauthorized. Please login first."
    });
    return;
  }

  // Attach admin info to request for use in routes
  (req as any).admin = { role: String(adminRole), username: String(adminUsername) };
  next();
}

// Middleware to check main admin only
function requireMainAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminRole = req.headers['x-admin-role'];

  if (!adminRole || Array.isArray(adminRole) || adminRole !== "main_admin") {
    res.status(403).json({
      message: "Access denied. Only main admin can perform this action."
    });
    return;
  }

  next();
}

// Middleware to check university admin or main admin
function requireUniversityAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminRole = req.headers['x-admin-role'];

  if (!adminRole || Array.isArray(adminRole) || (adminRole !== "main_admin" && adminRole !== "university_admin")) {
    res.status(403).json({
      message: "Access denied. Only university admin or main admin can perform this action."
    });
    return;
  }

  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ================= SEED ADMINS (for initial setup) =================
  app.post(api.admin.seed.path, async (_req, res) => {
    try {
      // Check if admins already exist
      const existingAdmins = await storage.getAdmins();
      if (existingAdmins.length > 0) {
        return res.json({ success: false, message: "Admins already seeded" });
      }

      // Create admin accounts with email addresses
      await storage.createAdmin("admin", "dpo@jntugv.edu.in", "Admin@Careers2026", "main_admin");
      await storage.createAdmin("jntugv_tpo", "tpo@jntugv.edu.in", "Jntugv@Careers2026", "university_admin");
      await storage.createAdmin("nirmaan_admin", "admin@nirmaan.org", "Nirmaan@2026", "organization_admin");

      return res.json({ success: true, message: "Admin accounts created successfully" });
    } catch (err) {
      console.error("SEED ERROR:", err);
      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= ADMIN LOGIN =================
  app.post(api.admin.login.path, async (req, res) => {
    try {
      const input = api.admin.login.input.parse(req.body);

      // Check if admins exist, if not seed them
      const existingAdmins = await storage.getAdmins();
      if (existingAdmins.length === 0) {
        console.log("No admins found, seeding default admins...");
        try {
          await storage.createAdmin("admin", "dpo@jntugv.edu.in", "Admin@Careers2026", "main_admin");
          await storage.createAdmin("jntugv_tpo", "tpo@jntugv.edu.in", "Jntugv@Careers2026", "university_admin");
          await storage.createAdmin("nirmaan_admin", "admin@nirmaan.org", "Nirmaan@2026", "organization_admin");
          console.log("Default admins seeded successfully");
        } catch (seedErr) {
          console.error("Error seeding admins:", seedErr);
        }
      }

      // Get admin from database
      const admin = await storage.getAdminByUsername(input.username);

      if (!admin || admin.passwordHash !== hashPassword(input.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({ message: "Your account has been disabled. Contact the main admin." });
      }

      return res.json({
        success: true,
        role: admin.role,
        username: admin.username,
      });
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input format" });
      }

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= FORGOT PASSWORD =================
  app.post(api.admin.forgotPassword.path, async (req, res) => {
    try {
      const input = api.admin.forgotPassword.input.parse(req.body);
      const email = input.email.toLowerCase().trim();

      // Get base URL from request
      const protocol = req.protocol;
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;

      // Check if admin exists with this email
      const admin = await storage.getAdminByEmail(email);

      // Always return success to prevent email enumeration
      // But only send email if admin exists
      if (admin) {
        const result = await storage.createPasswordResetToken(email);

        if (result) {
          await sendPasswordResetEmail(
            admin.email,
            admin.username,
            result.token,
            baseUrl
          );
        }
      }

      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    } catch (err) {
      console.error("FORGOT PASSWORD ERROR:", err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input format" });
      }

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= RESET PASSWORD =================
  app.post(api.admin.resetPassword.path, async (req, res) => {
    try {
      const input = api.admin.resetPassword.input.parse(req.body);

      // Reset password using token
      const admin = await storage.resetPassword(input.token, input.newPassword);

      if (!admin) {
        return res.status(400).json({
          message: "Invalid or expired reset token. Please request a new password reset."
        });
      }

      // Send confirmation email
      await sendPasswordChangedEmail(admin.email, admin.username);

      return res.json({
        success: true,
        message: "Password reset successful. You can now log in with your new password."
      });
    } catch (err) {
      console.error("RESET PASSWORD ERROR:", err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input format" });
      }

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= VERIFY RESET TOKEN =================
  app.get(api.admin.verifyResetToken.path, async (req, res) => {
    try {
      const token = req.query.token as string;

      if (!token) {
        return res.status(400).json({ valid: false, message: "Token is required" });
      }

      const admin = await storage.getAdminByResetToken(token);

      if (!admin) {
        return res.status(400).json({ valid: false, message: "Invalid or expired token" });
      }

      return res.json({ valid: true, username: admin.username });
    } catch (err) {
      console.error("VERIFY TOKEN ERROR:", err);
      return res.status(500).json({ valid: false, message: "Server error" });
    }
  });

  // ================= CREATE REGISTRATION =================
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);

      console.log("Incoming registration:", input);

      const registration = await storage.createRegistration(input);

      return res.status(201).json(registration);
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);

      if (err instanceof DuplicateRegistrationError) {
        return res.status(409).json({
          message: err.message,
          field: err.field,
          duplicate: true,
        });
      }

      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= GET ALL REGISTRATIONS (Protected) =================
  app.get(api.registrations.list.path, requireAdminAuth, async (req, res) => {
    try {
      const data = await storage.getRegistrations();
      return res.json(data);
    } catch (err) {
      console.error("FETCH REGISTRATIONS ERROR:", err);
      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= DOWNLOAD EXCEL (Protected) =================
  app.get(api.registrations.download.path, requireAdminAuth, async (req, res) => {
    try {
      const data = await storage.getRegistrations();

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Registrations");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Full Name", key: "fullName", width: 30 },
        { header: "DOB", key: "dob", width: 15 },
        { header: "Age", key: "age", width: 10 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Gender", key: "gender", width: 10 },
        { header: "Passed Year", key: "passedYear", width: 15 },
        { header: "Status", key: "status", width: 15 },
        { header: "Qualification", key: "qualification", width: 20 },
        { header: "District", key: "district", width: 20 },
        { header: "Caste", key: "caste", width: 15 },
        { header: "Preferred Location", key: "preferredLocation", width: 20 },
        { header: "Has Certificates", key: "hasCertificates", width: 15 },
        { header: "Certificate Details", key: "certificateDetails", width: 40 },
        { header: "Created At", key: "createdAt", width: 25 },
      ];

      data.forEach((reg) => {
        worksheet.addRow(reg);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="registrations.xlsx"'
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error("DOWNLOAD ERROR:", err);
      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= UPDATE REGISTRATION STATUS (University Admin or Main Admin) =================
  app.patch(api.registrations.updateStatus.path, requireAdminAuth, requireUniversityAdmin, async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = typeof idParam === 'string' ? parseInt(idParam) : parseInt(String(idParam));
      const input = api.registrations.updateStatus.input.parse(req.body);

      const updated = await storage.updateRegistrationStatus(id, input.status);
      return res.json(updated);
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input format" });
      }

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= DELETE REGISTRATION (Main Admin Only) =================
  app.delete(api.registrations.delete.path, requireAdminAuth, requireMainAdmin, async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = typeof idParam === 'string' ? parseInt(idParam) : parseInt(String(idParam));
      await storage.deleteRegistration(id);
      return res.json({ success: true });
    } catch (err) {
      console.error("DELETE REGISTRATION ERROR:", err);

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= GET ALL ADMINS (Main Admin Only) =================
  app.get("/api/admins", requireAdminAuth, requireMainAdmin, async (_req, res) => {
    try {
      const admins = await storage.getAdmins();
      // Return admins without passwordHash
      const safeAdmins = admins.map(admin => ({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
      }));
      return res.json(safeAdmins);
    } catch (err) {
      console.error("FETCH ADMINS ERROR:", err);
      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= UPDATE ADMIN (Main Admin Only) =================
  app.put("/api/admins/:id", requireAdminAuth, requireMainAdmin, async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = typeof idParam === 'string' ? parseInt(idParam) : parseInt(String(idParam));
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required" });
      }

      const updated = await storage.updateAdmin(id, { username, email });

      // Return without passwordHash
      return res.json({
        id: updated.id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
        createdAt: updated.createdAt,
      });
    } catch (err) {
      console.error("UPDATE ADMIN ERROR:", err);

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= TOGGLE ADMIN STATUS (Main Admin Only) =================
  app.patch("/api/admins/:id/status", requireAdminAuth, requireMainAdmin, async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = typeof idParam === 'string' ? parseInt(idParam) : parseInt(String(idParam));
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "isActive must be a boolean" });
      }

      const updated = await storage.updateAdmin(id, { isActive });

      // Return without passwordHash
      return res.json({
        id: updated.id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
        createdAt: updated.createdAt,
      });
    } catch (err) {
      console.error("UPDATE ADMIN STATUS ERROR:", err);

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  // ================= DELETE ADMIN (Main Admin Only) =================
  app.delete("/api/admins/:id", requireAdminAuth, requireMainAdmin, async (req, res) => {
    try {
      const idParam = req.params.id;
      const id = typeof idParam === 'string' ? parseInt(idParam) : parseInt(String(idParam));

      // Prevent deleting self
      const adminUsername = req.headers['x-admin-username'];
      const admin = await storage.getAdminById(id);

      if (admin && admin.username === adminUsername) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }

      await storage.deleteAdmin(id);
      return res.json({ success: true });
    } catch (err) {
      console.error("DELETE ADMIN ERROR:", err);

      return res.status(500).json({
        message: "Server error",
        error: (err as Error).message,
      });
    }
  });

  return httpServer;
}
