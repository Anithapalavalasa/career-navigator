import { api } from "@shared/routes";
import exceljs from "exceljs";
import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ================= ADMIN LOGIN =================
  app.post(api.admin.login.path, async (req, res) => {
    try {
      const input = api.admin.login.input.parse(req.body);

      if (input.username === "admin" && input.password === "Admin@Carrers") {
        return res.json({ success: true });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
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

  // ================= CREATE REGISTRATION =================
  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);

      console.log("Incoming registration:", input);

      const registration = await storage.createRegistration(input);

      return res.status(201).json(registration);
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);

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

  // ================= GET ALL REGISTRATIONS =================
  app.get(api.registrations.list.path, async (_req, res) => {
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

  // ================= DOWNLOAD EXCEL =================
  app.get(api.registrations.download.path, async (_req, res) => {
    try {
      const data = await storage.getRegistrations();

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Registrations");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Full Name", key: "fullName", width: 30 },
        { header: "DOB", key: "dob", width: 15 },
        { header: "Age", key: "age", width: 10 },
        {header: "Email", key: "email", width: 30 },
        {header: "Phone", key: "phone", width: 20 },
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

  return httpServer;
}