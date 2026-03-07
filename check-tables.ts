import "dotenv/config";
import pg from "pg";

async function checkDb() {
    const { Pool } = pg;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        console.log("Connecting to:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":****@"));
        const client = await pool.connect();
        console.log("Connected successfully!");

        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log("Tables found:");
        res.rows.forEach(row => console.log(` - ${row.table_name}`));

        client.release();
    } catch (err) {
        console.error("Database connection failed:", (err as Error).message);
    } finally {
        await pool.end();
    }
}

checkDb();
