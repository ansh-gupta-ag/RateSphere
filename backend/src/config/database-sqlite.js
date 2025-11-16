const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../store_ratings.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Wrapper to make it compatible with pg pool interface
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert PostgreSQL $1, $2 to SQLite ? placeholders
        let sqliteSql = sql;
        if (params.length > 0) {
          let paramIndex = 1;
          sqliteSql = sql.replace(/\$\d+/g, () => '?');
        }

        // Handle different query types
        if (sqliteSql.trim().toUpperCase().startsWith('SELECT') || 
            sqliteSql.trim().toUpperCase().startsWith('RETURNING')) {
          const stmt = db.prepare(sqliteSql);
          const rows = stmt.all(...params);
          resolve({ rows, rowCount: rows.length });
        } else if (sqliteSql.includes('RETURNING')) {
          // INSERT/UPDATE/DELETE with RETURNING
          const mainSql = sqliteSql.split('RETURNING')[0].trim();
          const stmt = db.prepare(mainSql);
          const info = stmt.run(...params);
          
          // Get the inserted/updated row
          if (info.lastInsertRowid) {
            const selectStmt = db.prepare('SELECT * FROM ' + 
              (sqliteSql.includes('INSERT INTO users') ? 'users' :
               sqliteSql.includes('INSERT INTO stores') ? 'stores' :
               sqliteSql.includes('INSERT INTO ratings') ? 'ratings' : 'users') +
              ' WHERE id = ?');
            const rows = selectStmt.all(info.lastInsertRowid);
            resolve({ rows, rowCount: rows.length });
          } else {
            resolve({ rows: [], rowCount: info.changes });
          }
        } else {
          // Regular INSERT/UPDATE/DELETE
          const stmt = db.prepare(sqliteSql);
          const info = stmt.run(...params);
          resolve({ rows: [], rowCount: info.changes });
        }
      } catch (error) {
        // Map SQLite errors to PostgreSQL-like errors
        if (error.message.includes('UNIQUE constraint')) {
          error.code = '23505';
        }
        reject(error);
      }
    });
  },
  
  connect: () => {
    return Promise.resolve({
      query: pool.query,
      release: () => {}
    });
  }
};

module.exports = pool;
