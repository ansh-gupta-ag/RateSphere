const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const validators = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/errorHandler');

router.post('/signup', validators.signup, handleValidationErrors, signup);
router.post('/login', validators.login, handleValidationErrors, login);

module.exports = router;
