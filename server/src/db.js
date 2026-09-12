const { Pool } = require('pg');
const dns = require('dns');

// Public DNS fallback for environments where local ISP/OS DNS fails to resolve cloud DBaaS hostnames (e.g. Neon)
try {
  const origLookup = dns.lookup;
  dns.lookup = (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    origLookup(hostname, options, (err, address, family) => {
      if (err && (err.code === 'ENOTFOUND' || err.code === 'EREFUSED')) {
        const resolver = new dns.Resolver();
        resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
        return resolver.resolve4(hostname, (resErr, addresses) => {
          if (!resErr && addresses && addresses.length > 0) {
            if (options && options.all) {
              return callback(null, addresses.map((a) => ({ address: a, family: 4 })));
            }
            return callback(null, addresses[0], 4);
          }
          callback(err, address, family);
        });
      }
      callback(err, address, family);
    });
  };
} catch (_) {}

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
