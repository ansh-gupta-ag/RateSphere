const pool = require('../config/database');

const createRating = async (req, res) => {
  try {
    const { store_id, rating, comment } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [store_id, user_id, rating, comment]
    );

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'You have already rated this store. Use update instead.' });
    }
    throw error;
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      `UPDATE ratings 
       SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [rating, comment, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or unauthorized' });
    }

    res.json({
      message: 'Rating updated successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    throw error;
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      'DELETE FROM ratings WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or unauthorized' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createRating,
  updateRating,
  deleteRating
};
