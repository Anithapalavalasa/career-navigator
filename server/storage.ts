import { registrations, type InsertRegistration, type Registration } from "@shared/schema";
import { eq, or } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
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

export class DatabaseStorage implements IStorage {
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    // ── Duplicate check (email OR phone) ──────────────────────────────────
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
    // ─────────────────────────────────────────────────────────────────────

    const [inserted] = await db.insert(registrations).values(registration).returning();
    return inserted;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }
}

export const storage = new DatabaseStorage();
