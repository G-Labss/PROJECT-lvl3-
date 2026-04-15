const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  },
  startTime: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

const availabilitySchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  slots: [timeSlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
