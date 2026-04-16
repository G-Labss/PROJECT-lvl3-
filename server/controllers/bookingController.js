const Booking = require('../models/Booking');

// GET /api/bookings (admin only)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('lesson', 'title price level duration')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/:id/pay (admin only)
exports.markAsPaid = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid' },
      { new: true }
    ).populate('lesson', 'title price level duration');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/rankings — aggregate students by lesson count
exports.getStudentRankings = async (req, res, next) => {
  try {
    const rankings = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$studentEmail',
          studentName: { $last: '$studentName' },
          totalLessons: { $sum: 1 },
          ntrpRating: { $max: '$studentNtrp' },
        },
      },
      { $sort: { totalLessons: -1 } },
    ]);
    res.status(200).json({ success: true, data: rankings });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/student-ntrp — update NTRP for all bookings by email (admin only)
exports.updateStudentNtrp = async (req, res, next) => {
  try {
    const { studentEmail, ntrpRating } = req.body;
    await Booking.updateMany({ studentEmail }, { studentNtrp: ntrpRating });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/upcoming/:email — next scheduled lesson for a student
exports.getUpcomingLesson = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const booking = await Booking.findOne({
      studentEmail: req.params.email.toLowerCase(),
      scheduledDate: { $gte: today },
    })
      .populate('lesson', 'title level duration')
      .sort({ scheduledDate: 1 });

    res.status(200).json({ success: true, data: booking || null });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('lesson', 'title price level duration');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
