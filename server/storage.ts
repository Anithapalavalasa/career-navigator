import { admins, notifications, registrations, type Admin, type InsertNotification, type InsertRegistration, type Notification, type Registration } from "@shared/schema";
import crypto from "crypto";
import { eq, or } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  // Admin methods
  getAdmins(): Promise<Admin[]>;
  getAdminById(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(username: string, email: string, password: string, role: "main_admin" | "university_admin" | "organization_admin"): Promise<Admin>;
  updateAdmin(id: number, data: { username?: string; email?: string; isActive?: boolean }): Promise<Admin>;
  updateAdminPassword(id: number, newPassword: string): Promise<Admin>;
  deleteAdmin(id: number): Promise<void>;
  // Password reset methods
  createPasswordResetToken(email: string): Promise<{ token: string; expiresAt: Date } | null>;
  getAdminByResetToken(token: string): Promise<Admin | undefined>;
  resetPassword(token: string, newPassword: string): Promise<Admin | null>;
  // Registration management (main_admin and university_admin)
  updateRegistrationStatus(id: number, status: string): Promise<Registration>;
  deleteRegistration(id: number): Promise<void>;
  // Notification methods
  getNotifications(activeOnly?: boolean): Promise<Notification[]>;
  getNotificationById(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, data: Partial<InsertNotification>): Promise<Notification>;
  deleteNotification(id: number): Promise<void>;
}

// Custom error class for duplicate entries
export class DuplicateRegistrationError extends Error {
  field: "email" | "phone" | "both";
  constructor(field: "email" | "phone" | "both") {
    super(`A registration already exists with this ${field === "both" ? "email and phone" : field}.`);
    this.name = "DuplicateRegistrationError";
    this.field = field;
  }
}

// Custom error class for duplicate admin fields
export class DuplicateAdminError extends Error {
  field: "email" | "username";
  constructor(field: "email" | "username") {
    super(
      field === "email"
        ? "This email is already used by another admin account."
        : "This username is already taken by another admin account."
    );
    this.name = "DuplicateAdminError";
    this.field = field;
  }
}

// Simple hash function for passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export class DatabaseStorage implements IStorage {
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    // Duplicate check (email OR phone)
    const existing = await db
      .select({ id: registrations.id, email: registrations.email, phone: registrations.phone })
      .from(registrations)
      .where(
        or(
          eq(registrations.email, registration.email),
          eq(registrations.phone, registration.phone)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const match = existing[0];
      const emailMatch = match.email === registration.email;
      const phoneMatch = match.phone === registration.phone;

      if (emailMatch && phoneMatch) throw new DuplicateRegistrationError("both");
      if (emailMatch) throw new DuplicateRegistrationError("email");
      if (phoneMatch) throw new DuplicateRegistrationError("phone");
    }

    const [inserted] = await db.insert(registrations).values(registration).returning();
    return inserted;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  // Admin methods
  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);
    return result[0];
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);
    return result[0];
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);
    return result[0];
  }

  async createAdmin(
    username: string,
    email: string,
    password: string,
    role: "main_admin" | "university_admin" | "organization_admin"
  ): Promise<Admin> {
    const [inserted] = await db.insert(admins).values({
      username,
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role,
    }).returning();
    return inserted;
  }

  async updateAdmin(id: number, data: { username?: string; email?: string; isActive?: boolean }): Promise<Admin> {
    const updateData: Partial<Admin> = {};

    // Check for duplicate email (excluding the current admin)
    if (data.email !== undefined) {
      const normalizedEmail = data.email.toLowerCase();
      const existing = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.email, normalizedEmail))
        .limit(1);
      if (existing.length > 0 && existing[0].id !== id) {
        throw new DuplicateAdminError("email");
      }
      updateData.email = normalizedEmail;
    }

    // Check for duplicate username (excluding the current admin)
    if (data.username !== undefined) {
      const existing = await db
        .select({ id: admins.id })
        .from(admins)
        .where(eq(admins.username, data.username))
        .limit(1);
      if (existing.length > 0 && existing[0].id !== id) {
        throw new DuplicateAdminError("username");
      }
      updateData.username = data.username;
    }

    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const [updated] = await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, id))
      .returning();
    return updated;
  }

  async deleteAdmin(id: number): Promise<void> {
    await db.delete(admins).where(eq(admins.id, id));
  }

  async updateAdminPassword(id: number, newPassword: string): Promise<Admin> {
    const [updated] = await db
      .update(admins)
      .set({
        passwordHash: hashPassword(newPassword),
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(admins.id, id))
      .returning();
    return updated;
  }

  // Password reset methods
  async createPasswordResetToken(email: string): Promise<{ token: string; expiresAt: Date } | null> {
    const admin = await this.getAdminByEmail(email);
    if (!admin) {
      return null;
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db
      .update(admins)
      .set({
        resetToken: token,
        resetTokenExpiry: expiresAt,
      })
      .where(eq(admins.id, admin.id));

    return { token, expiresAt };
  }

  async getAdminByResetToken(token: string): Promise<Admin | undefined> {
    const result = await db
      .select()
      .from(admins)
      .where(eq(admins.resetToken, token))
      .limit(1);

    const admin = result[0];
    if (!admin || !admin.resetTokenExpiry) {
      return undefined;
    }

    // Check if token is expired
    if (new Date() > new Date(admin.resetTokenExpiry)) {
      return undefined;
    }

    return admin;
  }

  async resetPassword(token: string, newPassword: string): Promise<Admin | null> {
    const admin = await this.getAdminByResetToken(token);
    if (!admin) {
      return null;
    }

    const [updated] = await db
      .update(admins)
      .set({
        passwordHash: hashPassword(newPassword),
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(admins.id, admin.id))
      .returning();

    return updated;
  }

  // Registration management (main_admin only)
  async updateRegistrationStatus(id: number, status: string): Promise<Registration> {
    const [updated] = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .returning();
    return updated;
  }

  async deleteRegistration(id: number): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id));
  }

  // Notification implementation
  async getNotifications(activeOnly: boolean = false): Promise<Notification[]> {
    if (activeOnly) {
      return await db.select().from(notifications).where(eq(notifications.isActive, true));
    }
    return await db.select().from(notifications);
  }

  async getNotificationById(id: number): Promise<Notification | undefined> {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);
    return result[0];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [inserted] = await db.insert(notifications).values(notification).returning();
    return inserted;
  }

  async updateNotification(id: number, data: Partial<InsertNotification>): Promise<Notification> {
    const [updated] = await db
      .update(notifications)
      .set(data)
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
