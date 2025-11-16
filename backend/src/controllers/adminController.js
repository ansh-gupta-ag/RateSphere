const pool = require('../config/database');

const getMetrics = async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const storesResult = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingsResult = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(usersResult.rows[0].count),
      totalStores: parseInt(storesResult.rows[0].count),
      totalRatings: parseInt(ratingsResult.rows[0].count)
    });
  } catch (error) {
    throw error;
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (role) {
      paramCount++;
      query += ` AND role = $${paramCount}`;
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    const countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1' +
      (search ? ` AND (name ILIKE '%${search}%' OR email ILIKE '%${search}%')` : '') +
      (role ? ` AND role = '${role}'` : '');
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMetrics,
  getUsers,
  deleteUser
};
