const { body } = require('express-validator');

// Validation rules for creating a lesson
exports.validateLesson = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('duration')
    .isInt({ min: 30 }).withMessage('Duration must be at least 30 minutes'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'All Levels'])
    .withMessage('Invalid level'),
  
  body('maxStudents')
    .optional()
    .isInt({ min: 1 }).withMessage('Must allow at least 1 student'),
];

// Validation rules for creating a user
exports.validateUser = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('ntrpRating')
    .optional()
    .isFloat({ min: 1.0, max: 7.0 }).withMessage('NTRP rating must be between 1.0 and 7.0'),
  
  body('yearsExperience')
    .optional()
    .isInt({ min: 0 }).withMessage('Years of experience cannot be negative'),
];