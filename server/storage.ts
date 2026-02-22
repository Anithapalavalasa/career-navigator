import { db } from "./db";
import { registrations, type InsertRegistration, type Registration } from "@shared/schema";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
}

export class DatabaseStorage implements IStorage {
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [inserted] = await db.insert(registrations).values(registration).returning();
    return inserted;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }
}

export const storage = new DatabaseStorage();