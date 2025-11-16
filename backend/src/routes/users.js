const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
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

// Update password (user and owner)
router.put('/password', authenticate, validators.updatePassword, validate, updatePassword);

module.exports = router;
