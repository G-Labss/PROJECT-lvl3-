const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  paymentMethod: {
    type: String,
    enum: ['zelle'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  studentNtrp: {
    type: Number,
    min: 1.0,
    max: 7.0,
  },
  notes: String,
  scheduledDate: Date,
  scheduledTime: String,
  availabilitySlotId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
