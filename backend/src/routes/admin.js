const express = require('express');
const router = express.Router();
const { getMetrics, getUsers, deleteUser } = require('../controllers/adminController');
const { createUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const validators = require('../utils/validators');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/metrics', authenticate, authorize('admin'), getMetrics);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.post('/users', authenticate, authorize('admin'), validators.createUser, validate, createUser);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
