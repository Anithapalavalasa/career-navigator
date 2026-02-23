const { Client } = require('pg');
const fs = require('fs');

function loadEnv() {
  const path = './.env';
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(2);
}

function toAdminConn(url) {
  // Normalize scheme so URL parser accepts it
  const normalized = url.replace(/^postgresql:/, 'postgres:');
  const u = new URL(normalized);
  const dbName = (u.pathname || '').replace(/^\//, '') || 'postgres';
  const search = u.search || '';
  // connect to 'postgres' maintenance DB
  u.pathname = '/postgres';
  const adminUrl = u.toString().replace(/^postgres:/, 'postgresql:') + search;
  return { adminUrl, dbName };
}

async function main() {
  const { adminUrl, dbName } = toAdminConn(DATABASE_URL);
  const client = new Client({ connectionString: adminUrl });
  try {
    await client.connect();
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rowCount > 0) {
      console.log(`database "${dbName}" already exists`);
      await client.end();
      process.exit(0);
    }
    console.log(`creating database "${dbName}"...`);
    // Use IDENTIFIER quoting
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log('created database successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('failed to create database:', err.message || err);
    try { await client.end(); } catch(_){}
    process.exit(1);
  }
}

main();
