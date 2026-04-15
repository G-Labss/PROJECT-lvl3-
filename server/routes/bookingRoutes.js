const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllBookings, getBookingById, markAsPaid, getStudentRankings, updateStudentNtrp } = require('../controllers/bookingController');

router.get('/', protect, getAllBookings);
router.get('/rankings', getStudentRankings);
router.get('/:id', getBookingById);
router.patch('/:id/pay', protect, markAsPaid);
router.patch('/student-ntrp', protect, updateStudentNtrp);

module.exports = router;
