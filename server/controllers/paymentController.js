const Booking = require('../models/Booking');
const Lesson = require('../models/Lesson');

// POST /api/payments/zelle
exports.createZelleBooking = async (req, res, next) => {
  try {
    const { lessonId, studentName, studentEmail, notes, scheduledDate, scheduledTime, availabilitySlotId } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check for slot conflicts if a scheduled time was provided
    if (scheduledDate && scheduledTime) {
      const dayStart = new Date(scheduledDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(scheduledDate);
      dayEnd.setHours(23, 59, 59, 999);

      const conflict = await Booking.findOne({
        scheduledDate: { $gte: dayStart, $lte: dayEnd },
        scheduledTime,
        paymentStatus: { $ne: 'failed' },
      });

      if (conflict) {
        return res.status(409).json({ success: false, message: 'This time slot is no longer available. Please choose another.' });
      }
    }

    const booking = await Booking.create({
      lesson: lessonId,
      studentName,
      studentEmail,
      paymentMethod: 'zelle',
      paymentStatus: 'pending',
      amount: lesson.price,
      notes,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      scheduledTime: scheduledTime || undefined,
      availabilitySlotId: availabilitySlotId || undefined,
    });

    await booking.populate('lesson', 'title duration price level');

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
