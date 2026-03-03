import { db } from "../server/db";
import { admins } from "../shared/schema";

async function main() {
  console.log("Testing database connection...");
  
  try {
    const result = await db.select().from(admins).limit(1);
    console.log("Database connected successfully!");
    console.log("Admins table columns:", Object.keys(result[0] || {}));
    console.log("Sample admin:", result[0]);
  } catch (error: any) {
    console.error("Error:", error.message);
    if (error.message.includes("is_active")) {
      console.log("\nThe is_active column still doesn't exist.");
      console.log("Please run: npx tsx scripts/add-is-active-column.ts");
    }
  }
  
  process.exit(0);
}

main();
