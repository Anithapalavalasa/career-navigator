import "dotenv/config";
import { db } from "./server/db";
import { notifications } from "./shared/schema";

async function test() {
    try {
        console.log("Testing database connection and notifications table...");
        const result = await db.select().from(notifications);
        console.log("Success! Found", result.length, "notifications.");
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        process.exit();
    }
}

test();
