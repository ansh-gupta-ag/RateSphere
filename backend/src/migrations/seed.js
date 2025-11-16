const pool = require('../config/database');
const bcrypt = require('bcrypt');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Seeding database...');

    // Check if data already exists
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Hash passwords
    const adminPass = await bcrypt.hash('Admin@123!', 10);
    const userPass = await bcrypt.hash('User@123!', 10);
    const ownerPass = await bcrypt.hash('Owner@123!', 10);

    // Insert users
    const adminResult = await client.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['System Administrator User', 'admin@example.com', adminPass, '123 Admin Street, Admin City, AC 12345', 'admin']
    );

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Regular Normal User Account', 'user@example.com', userPass, '456 User Avenue, User Town, UT 67890', 'user']
    );

    const ownerResult = await client.query(
      `INSERT INTO users (name, email, password_hash, address, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Store Owner Account User', 'owner@example.com', ownerPass, '789 Owner Boulevard, Owner City, OC 11111', 'owner']
    );

    console.log('✓ Users created');

    // Insert stores
    const stores = [
      ['Tech Haven Electronics', 'contact@techhaven.com', '100 Tech Street, Silicon Valley, CA 94000', ownerResult.rows[0].id],
      ['Green Grocery Market Store', 'info@greengrocery.com', '200 Fresh Avenue, Portland, OR 97000', ownerResult.rows[0].id],
      ['Fashion Forward Boutique', 'hello@fashionforward.com', '300 Style Lane, New York, NY 10000', null],
      ['Book Nook Library Store', 'books@booknook.com', '400 Reading Road, Boston, MA 02000', null],
      ['Coffee Corner Cafe Shop', 'cafe@coffeecorner.com', '500 Brew Street, Seattle, WA 98000', null]
    ];

    const storeIds = [];
    for (const store of stores) {
      const result = await client.query(
        `INSERT INTO stores (name, email, address, owner_id) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        store
      );
      storeIds.push(result.rows[0].id);
    }

    console.log('✓ Stores created');

    // Insert sample ratings
    const ratings = [
      [storeIds[0], userResult.rows[0].id, 5, 'Excellent service and great products!'],
      [storeIds[1], userResult.rows[0].id, 4, 'Fresh produce, good prices'],
      [storeIds[2], userResult.rows[0].id, 3, 'Nice selection but a bit pricey']
    ];

    for (const rating of ratings) {
      await client.query(
        `INSERT INTO ratings (store_id, user_id, rating, comment) 
         VALUES ($1, $2, $3, $4)`,
        rating
      );
    }

    console.log('✓ Ratings created');
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
