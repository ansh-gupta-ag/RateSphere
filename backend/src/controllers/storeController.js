const pool = require('../config/database');

const getStores = async (req, res) => {
  try {
    const { search, address, sort = 'name', order = 'asc', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    if (address) {
      paramCount++;
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
    }

    query += ` GROUP BY s.id`;

    const validSorts = { name: 's.name', created_at: 's.created_at', rating: 'avg_rating' };
    const sortColumn = validSorts[sort] || 's.name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    const countQuery = `SELECT COUNT(*) FROM stores s WHERE 1=1` +
      (search ? ` AND s.name ILIKE '%${search}%'` : '') +
      (address ? ` AND s.address ILIKE '%${address}%'` : '');
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      stores: result.rows.map(store => ({
        ...store,
        avg_rating: parseFloat(store.avg_rating).toFixed(1)
      })),
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

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const storeQuery = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
    `;
    const storeResult = await pool.query(storeQuery, [id]);

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = storeResult.rows[0];
    store.avg_rating = parseFloat(store.avg_rating).toFixed(1);

    if (userId) {
      const userRatingResult = await pool.query(
        'SELECT id, rating, comment FROM ratings WHERE store_id = $1 AND user_id = $2',
        [id, userId]
      );
      store.user_rating = userRatingResult.rows[0] || null;
    }

    res.json(store);
  } catch (error) {
    throw error;
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, email, address, owner_id]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    const fields = [];
    const values = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      fields.push(`name = $${paramCount}`);
      values.push(name);
    }
    if (email !== undefined) {
      paramCount++;
      fields.push(`email = $${paramCount}`);
      values.push(email);
    }
    if (address !== undefined) {
      paramCount++;
      fields.push(`address = $${paramCount}`);
      values.push(address);
    }
    if (owner_id !== undefined) {
      paramCount++;
      fields.push(`owner_id = $${paramCount}`);
      values.push(owner_id);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE stores SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({
      message: 'Store updated successfully',
      store: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    throw error;
  }
};

const getStoreRaters = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const storeResult = await pool.query(
      'SELECT owner_id FROM stores WHERE id = $1',
      [id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (req.user.role !== 'admin' && storeResult.rows[0].owner_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      `SELECT 
        r.id, r.rating, r.comment, r.created_at,
        u.id as user_id, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({ raters: result.rows });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRaters
};
