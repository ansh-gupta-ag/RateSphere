const express = require('express');
const router = express.Router();
const { createRating, updateRating, deleteRating } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const validators = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/errorHandler');

router.post('/', authenticate, authorize('user', 'owner'), validators.createRating, handleValidationErrors, createRating);
router.put('/:id', authenticate, authorize('user', 'owner'), validators.updateRating, handleValidationErrors, updateRating);
router.delete('/:id', authenticate, authorize('user', 'owner'), deleteRating);

module.exports = router;
