import crypto from "crypto";
import "dotenv/config";
import { db } from "../server/db";
import { admins } from "../shared/schema";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function seedAdmins() {
  console.log("Seeding admin accounts...");
  
  try {
    // Check if admins already exist
    const existingAdmins = await db.select().from(admins);
    if (existingAdmins.length > 0) {
      console.log("Admins already exist. Skipping seed.");
      console.log("Existing admins:", existingAdmins.map(a => a.username));
      return;
    }

    // Create admin accounts with updated passwords matching routes.ts
    const adminPassword = hashPassword("Admin@Careers2026");
    const universityPassword = hashPassword("Jntugv@Careers2026");
    const organizationPassword = hashPassword("Nirmaan@2026");

    await db.insert(admins).values([
      { username: "admin", email: "dpo@jntugv.edu.in", passwordHash: adminPassword, role: "main_admin" },
      { username: "jntugv_tpo", email: "tpo@jntugv.edu.in", passwordHash: universityPassword, role: "university_admin" },
      { username: "nirmaan_admin", email: "admin@nirmaan.org", passwordHash: organizationPassword, role: "organization_admin" },
    ]);

    console.log("Admin accounts created successfully!");
    console.log("Credentials:");
    console.log("  Main Admin: admin / Admin@Careers2026");
    console.log("  University Admin: jntugv_tpo / Jntugv@Careers2026");
    console.log("  Organization Admin: nirmaan_admin / Nirmaan@2026");
    
  } catch (error) {
    console.error("Error seeding admins:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedAdmins();
