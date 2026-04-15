const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAvailability,
  upsertAvailability,
  toggleSlot,
  getAvailabilitySummary,
} = require('../controllers/availabilityController');

// Public routes
router.get('/summary', getAvailabilitySummary); // live badge — must be before /:slotId
router.get('/', getAvailability);

// Admin-only routes
router.post('/', protect, upsertAvailability);
router.patch('/:slotId', protect, toggleSlot);

module.exports = router;
