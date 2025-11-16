require('dotenv').config();

// Use SQLite if DATABASE_TYPE is set to sqlite, otherwise use PostgreSQL
const useSQLite = process.env.DATABASE_TYPE === 'sqlite';

let pool;

if (useSQLite) {
  console.log('✓ Using SQLite database');
  pool = require('./database-sqlite');
} else {
  const { Pool } = require('pg');
  
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('connect', () => {
    console.log('✓ PostgreSQL database connected');
  });

  pool.on('error', (err) => {
    console.error('Database error:', err);
    process.exit(-1);
  });
}

module.exports = pool;
