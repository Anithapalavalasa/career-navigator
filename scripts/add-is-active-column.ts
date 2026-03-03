import { sql } from "drizzle-orm";
import { db } from "../server/db";

async function main() {
  console.log("Adding is_active column to admins table...");
  
  try {
    // Check if column exists
    await db.execute(sql`
      ALTER TABLE admins ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    `);
    console.log("Successfully added is_active column!");
  } catch (error: any) {
    if (error.code === "42701") {
      // Column already exists
      console.log("Column is_active already exists.");
    } else {
      console.error("Error adding column:", error.message);
      process.exit(1);
    }
  }
  
  process.exit(0);
}

main();
