import crypto from "crypto";
import "dotenv/config";
import { db } from "../server/db";
import { admins } from "../shared/schema";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function resetAdminPasswords() {
  console.log("Resetting admin passwords...");
  
  try {
    // Delete existing admins
    await db.delete(admins);
    console.log("Deleted existing admins.");
    
    // Create admin accounts with correct passwords
     const adminPassword = hashPassword("Admin@Careers2026");
    const universityPassword = hashPassword("Jntugv@Careers2026");
    const organizationPassword = hashPassword("Nirmaan@2026");

    await db.insert(admins).values([
      { username: "admin", email: "dpo@jntugv.edu.in", passwordHash: adminPassword, role: "main_admin" },
      { username: "jntugv_tpo", email: "tpo@jntugv.edu.in", passwordHash: universityPassword, role: "university_admin" },
      { username: "nirmaan_admin", email: "admin@nirmaan.org", passwordHash: organizationPassword, role: "organization_admin" },
    ]);

    console.log("Admin passwords reset successfully!");
    console.log("Credentials:");
    console.log("  Main Admin: admin / Admin@Careers2026");
    console.log("  University Admin: jntugv_tpo / Jntugv@Careers2026");
    console.log("  Organization Admin: nirmaan_admin / Nirmaan@2026");
    
  } catch (error) {
    console.error("Error resetting admin passwords:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

resetAdminPasswords();
