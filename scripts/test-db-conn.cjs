const { Pool } = require('pg');
const { spawnSync } = require('child_process');

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
    console.error('ERROR:', err.message || err);
    // If database does not exist, attempt to create it and retry once
    if (err.code === '3D000') {
      console.log('Database missing: attempting to create it now...');
      const res = spawnSync('node', ['scripts/create-db.cjs'], { stdio: 'inherit', env: process.env });
      if (res.status === 0) {
        console.log('Retrying DB connection...');
        try {
          const client2 = await pool.connect();
          console.log('OK: connected to database after creation');
          client2.release();
          await pool.end();
          process.exit(0);
        } catch (err2) {
          console.error('Retry failed:', err2.message || err2);
        }
      } else {
        console.error('Create DB script failed.');
      }
    }
    try { await pool.end(); } catch(_){}
    process.exit(1);
  }
})();
