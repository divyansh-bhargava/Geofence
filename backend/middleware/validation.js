const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('mobile')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid mobile number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('login')
    .notEmpty()
    .withMessage('Email or mobile is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Geofence validation
const validateGeofence = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Geofence name is required'),
  
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required'),
  
  body('radius')
    .isFloat({ min: 50, max: 5000 })
    .withMessage('Radius must be between 50 and 5000 meters'),
  
  body('duration')
    .isIn([6, 12, 24])
    .withMessage('Duration must be 6, 12, or 24 hours'),
  
  handleValidationErrors
];

// Contact validation
const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Contact name is required'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('mobile')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid mobile number'),
  
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.mobile) {
      throw new Error('Either email or mobile must be provided');
    }
    return true;
  }),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateGeofence,
  validateContact,
  validatePasswordChange,
  handleValidationErrors
};