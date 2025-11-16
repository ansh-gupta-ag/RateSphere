const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, '../../store_ratings.db');
const db = new Database(dbPath);

async function seedDatabase() {
  try {
    console.log('Seeding SQLite database...');
    db.pragma('foreign_keys = ON');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@123!', 10);
    const userPassword = await bcrypt.hash('User@123!', 10);
    const ownerPassword = await bcrypt.hash('Owner@123!', 10);

    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, address, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'Administrator User Account',
      'admin@example.com',
      adminPassword,
      '123 Admin Street, Admin City, AC 12345',
      'admin'
    );

    insertUser.run(
      'Regular User Account For Testing',
      'user@example.com',
      userPassword,
      '456 User Avenue, User Town, UT 67890',
      'user'
    );

    insertUser.run(
      'Store Owner Account For Management',
      'owner@example.com',
      ownerPassword,
      '789 Owner Boulevard, Owner City, OC 11111',
      'owner'
    );

    console.log('✓ Users created');

    // Get owner ID
    const owner = db.prepare('SELECT id FROM users WHERE email = ?').get('owner@example.com');

    // Insert stores
    const insertStore = db.prepare(`
      INSERT INTO stores (name, email, address, owner_id)
      VALUES (?, ?, ?, ?)
    `);

    insertStore.run(
      'Tech Haven Electronics',
      'contact@techhaven.com',
      '100 Tech Street, Silicon Valley, CA 94000',
      owner.id
    );

    insertStore.run(
      'Green Grocery Market',
      'info@greengrocery.com',
      '200 Fresh Avenue, Organic City, OR 97000',
      owner.id
    );

    insertStore.run(
      'Fashion Forward Boutique',
      'hello@fashionforward.com',
      '300 Style Boulevard, Fashion District, NY 10001',
      null
    );

    insertStore.run(
      'Book Lovers Paradise',
      'books@loversparadise.com',
      '400 Reading Lane, Library Town, MA 02000',
      null
    );

    insertStore.run(
      'Fitness First Gym',
      'join@fitnessfirst.com',
      '500 Health Road, Wellness City, TX 75000',
      null
    );

    console.log('✓ Stores created');

    // Get user and store IDs
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get('user@example.com');
    const stores = db.prepare('SELECT id FROM stores LIMIT 3').all();

    // Insert ratings
    const insertRating = db.prepare(`
      INSERT INTO ratings (store_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    if (stores.length >= 3) {
      insertRating.run(
        stores[0].id,
        user.id,
        5,
        'Excellent service and great products! Highly recommended.'
      );

      insertRating.run(
        stores[1].id,
        user.id,
        4,
        'Fresh produce and friendly staff. Will visit again.'
      );

      insertRating.run(
        stores[2].id,
        user.id,
        5,
        'Amazing collection and helpful recommendations!'
      );

      console.log('✓ Ratings created');
    }

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
