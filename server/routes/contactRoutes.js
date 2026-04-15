const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

router.post('/', validateContact, submitContact);

module.exports = router;
