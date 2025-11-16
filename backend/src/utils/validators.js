const { body, query, param } = require('express-validator');

const validators = {
  signup: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'user', 'owner'])
      .withMessage('Role must be admin, user, or owner')
  ],

  login: [
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  createStore: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Store name is required'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('owner_id')
      .optional()
      .isInt()
      .withMessage('Owner ID must be an integer')
  ],

  updateStore: [
    param('id').isInt().withMessage('Store ID must be an integer'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Store name cannot be empty'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters')
  ],

  createRating: [
    body('store_id')
      .isInt()
      .withMessage('Store ID must be an integer'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
  ],

  updateRating: [
    param('id').isInt().withMessage('Rating ID must be an integer'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
  ],

  storeQuery: [
    query('search').optional().trim(),
    query('address').optional().trim(),
    query('sort').optional().isIn(['name', 'created_at', 'rating']),
    query('order').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],

  updatePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .withMessage('New password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/)
      .withMessage('New password must contain at least one uppercase letter and one special character')
  ],

  createUser: [
    body('name')
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters'),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9])/)
      .withMessage('Password must contain at least one uppercase letter and one special character'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 400 })
      .withMessage('Address must not exceed 400 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'user', 'owner'])
      .withMessage('Role must be admin, user, or owner')
  ]
};

module.exports = validators;
