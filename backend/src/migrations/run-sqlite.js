const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../store_ratings.db');
const db = new Database(dbPath);

const migrations = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(name) >= 20 AND length(name) <= 60),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    address TEXT CHECK (length(address) <= 400),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'owner')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `,
  `
  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    address TEXT CHECK (length(address) <= 400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);
  CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name);
  `,
  `
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);
  CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);
  `
];

async function runMigrations() {
  try {
    console.log('Running SQLite migrations...');
    db.pragma('foreign_keys = ON');
    
    for (let i = 0; i < migrations.length; i++) {
      db.exec(migrations[i]);
      console.log(`✓ Migration ${i + 1} completed`);
    }
    console.log('✓ All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = runMigrations;
