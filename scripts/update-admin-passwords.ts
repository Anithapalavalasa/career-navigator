import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../server/db";
import { admins } from "../shared/schema";

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function updatePasswords() {
  console.log("Updating admin passwords...");
  
  // Update admin (main_admin)
  await db
    .update(admins)
    .set({ passwordHash: hashPassword("Admin@Careers2026") })
    .where(eq(admins.username, "admin"));
    
  console.log("Updated main admin password to: Admin@Careers2026");
  
  // Update jntugv_tpo (university_admin)
  await db
    .update(admins)
    .set({ passwordHash: hashPassword("Jntugv@Careers2026") })
    .where(eq(admins.username, "jntugv_tpo"));
    
  console.log("Updated university admin password to: Jntugv@Careers2026");
  
  // Update nirmaan_admin (organization_admin)
  await db
    .update(admins)
    .set({ passwordHash: hashPassword("Nirmaan@2026") })
    .where(eq(admins.username, "nirmaan_admin"));
    
  console.log("Updated organization admin password to: Nirmaan@2026");
  
  console.log("\nAll passwords updated successfully!");
  console.log("\nAdmin Credentials:");
  console.log("1. Main Admin: admin / Admin@Careers2026");
  console.log("2. University Admin: jntugv_tpo / Jntugv@Careers2026");
  console.log("3. Organization Admin: nirmaan_admin / Nirmaan@2026");
}

updatePasswords().catch(console.error);
