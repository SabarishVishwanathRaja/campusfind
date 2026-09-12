const { Pool } = require('pg');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === '') {
  throw new Error(
    '[CampusFind DB] DATABASE_URL is not set. Add your Neon connection string to server/.env (locally) or to the service environment variables (on Render).'
  );
}

const isLocal =
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('[CampusFind DB] Unexpected idle client error:', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};
