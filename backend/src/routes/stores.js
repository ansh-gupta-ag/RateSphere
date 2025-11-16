const express = require('express');
const router = express.Router();
const {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRaters
} = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const validators = require('../utils/validators');
const { handleValidationErrors } = require('../middleware/errorHandler');

router.get('/', validators.storeQuery, handleValidationErrors, getStores);
router.get('/:id', getStoreById);
router.post('/', authenticate, authorize('admin'), validators.createStore, handleValidationErrors, createStore);
router.put('/:id', authenticate, authorize('admin'), validators.updateStore, handleValidationErrors, updateStore);
router.delete('/:id', authenticate, authorize('admin'), deleteStore);
router.get('/:id/raters', authenticate, authorize('owner', 'admin'), getStoreRaters);

module.exports = router;
