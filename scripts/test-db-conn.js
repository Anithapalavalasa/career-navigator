const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL not set');
  process.exit(2);
}

(async () => {
  const pool = new Pool({ connectionString: url });
  try {
    const client = await pool.connect();
    console.log('OK: connected to database');
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    try { await pool.end(); } catch(_){}
    process.exit(1);
  }
})();
