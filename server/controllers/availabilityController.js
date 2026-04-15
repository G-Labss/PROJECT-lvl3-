const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET /api/availability
// Returns the coach's availability slots + booked slot info for the next 14 days
exports.getAvailability = async (req, res, next) => {
  try {
    const coach = await User.findOne();
    if (!coach) {
      return res.status(404).json({ success: false, message: 'No coach found' });
    }

    const availability = await Availability.findOne({ coach: coach._id });
    const slots = availability ? availability.slots : [];

    // Find all non-failed bookings with a scheduled date in the next 14 days
    const now = new Date();
    const twoWeeksOut = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const bookedSlots = await Booking.find({
      scheduledDate: { $gte: now, $lte: twoWeeksOut },
      paymentStatus: { $ne: 'failed' },
    }).select('scheduledDate scheduledTime availabilitySlotId');

    res.status(200).json({
      success: true,
      data: {
        slots,
        bookedSlots: bookedSlots.map(b => ({
          date: b.scheduledDate,
          time: b.scheduledTime,
          slotId: b.availabilitySlotId,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/availability  (admin only)
// Replace the coach's entire slot list
exports.upsertAvailability = async (req, res, next) => {
  try {
    const { slots } = req.body;

    if (!Array.isArray(slots)) {
      return res.status(400).json({ success: false, message: 'slots must be an array' });
    }

    const coach = await User.findOne();
    if (!coach) {
      return res.status(404).json({ success: false, message: 'No coach found' });
    }

    const availability = await Availability.findOneAndUpdate(
      { coach: coach._id },
      { coach: coach._id, slots },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    next(error);
  }
};

// GET /api/availability/summary
// Returns a lightweight summary for the live badge on the lessons page:
//   - spotsThisWeek: count of active, unbooked slots in the next 7 days
//   - nextOpening: { date, dayLabel, timeLabel } for the earliest open slot
//
// Day convention (matches AvailabilityManager on the client):
//   dayOfWeek 0 = Monday, 1 = Tuesday … 6 = Sunday
//   This is the DISPLAY index, not JS getDay() (which uses 0 = Sunday).
//   Conversion: jsDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1
//
// Time blocks stored as start-time keys matching the client TIME_BLOCKS constant:
//   '07:00' = Morning (7AM – Noon)
//   '12:00' = Afternoon (Noon – 5PM)
//   '17:00' = Evening (5PM – 9PM)
exports.getAvailabilitySummary = async (req, res, next) => {
  try {
    // ── 1. Load coach + their slot template ───────────────────────────────
    const coach = await User.findOne();
    if (!coach) {
      return res.status(200).json({ success: true, data: { spotsThisWeek: 0, nextOpening: null } });
    }

    const availability = await Availability.findOne({ coach: coach._id });
    // Only keep slots that are marked active
    const activeSlots = (availability?.slots || []).filter(s => s.isActive);

    if (activeSlots.length === 0) {
      return res.status(200).json({ success: true, data: { spotsThisWeek: 0, nextOpening: null } });
    }

    // ── 2. Build the set of already-booked (date + time) pairs ────────────
    // We look 7 days out to match spotsThisWeek
    const now = new Date();
    const sevenDaysOut = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      scheduledDate: { $gte: now, $lte: sevenDaysOut },
      paymentStatus: { $ne: 'failed' },
    }).select('scheduledDate scheduledTime');

    // Key = "YYYY-MM-DD|HH:MM" — used for O(1) collision checks below
    const bookedKeys = new Set(
      bookings.map(b => {
        const d = new Date(b.scheduledDate);
        const dateStr = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
        return `${dateStr}|${b.scheduledTime}`;
      })
    );

    // ── 3. Human-readable labels for time blocks ──────────────────────────
    const TIME_LABELS = {
      '07:00': 'Morning',
      '12:00': 'Afternoon',
      '17:00': 'Evening',
    };

    // Day names for the nextOpening label
    const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // ── 4. Walk through the next 7 days, count open slots ─────────────────
    let spotsThisWeek = 0;
    let nextOpening = null;

    for (let i = 0; i < 7; i++) {
      // Build a Date for this iteration's calendar day
      const day = new Date(now);
      day.setDate(now.getDate() + i);
      day.setHours(0, 0, 0, 0);

      // JS getDay(): 0=Sun, 1=Mon … 6=Sat
      // Convert to display dayOfWeek: Mon=0 … Sun=6
      const jsDay = day.getDay(); // e.g. 3 for Wednesday
      const displayDayOfWeek = jsDay === 0 ? 6 : jsDay - 1; // Sun(0)→6, Mon(1)→0, …

      const dateStr = day.toISOString().slice(0, 10); // "YYYY-MM-DD"

      // Find active template slots for this day of week
      const slotsForDay = activeSlots.filter(s => s.dayOfWeek === displayDayOfWeek);

      for (const slot of slotsForDay) {
        const key = `${dateStr}|${slot.startTime}`;

        if (!bookedKeys.has(key)) {
          // This slot is open
          spotsThisWeek++;

          // Track the earliest open slot as the nextOpening
          if (!nextOpening) {
            const isToday = i === 0;
            let dayLabel;
            if (isToday) {
              dayLabel = 'Today';
            } else if (i === 1) {
              dayLabel = 'Tomorrow';
            } else {
              dayLabel = DAY_NAMES[displayDayOfWeek]; // e.g. "Thursday"
            }

            nextOpening = {
              date: day.toISOString(),
              dayLabel,                                  // "Today" / "Tomorrow" / "Thursday"
              timeLabel: TIME_LABELS[slot.startTime] || slot.startTime, // "Morning" etc.
            };
          }
        }
      }
    }

    res.status(200).json({ success: true, data: { spotsThisWeek, nextOpening } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/availability/:slotId  (admin only)
// Toggle a single slot's isActive
exports.toggleSlot = async (req, res, next) => {
  try {
    const coach = await User.findOne();
    if (!coach) {
      return res.status(404).json({ success: false, message: 'No coach found' });
    }

    const availability = await Availability.findOne({ coach: coach._id });
    if (!availability) {
      return res.status(404).json({ success: false, message: 'No availability set up yet' });
    }

    const slot = availability.slots.id(req.params.slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    slot.isActive = !slot.isActive;
    await availability.save();

    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    next(error);
  }
};
