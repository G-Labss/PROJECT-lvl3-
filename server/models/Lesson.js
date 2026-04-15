const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [30, 'Duration must be at least 30 minutes'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  priceLabel: {
    type: String,
    default: '/session',
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
  },
  maxStudents: {
    type: Number,
    default: 1,
    min: [1, 'Must allow at least 1 student'],
  },
  minStudents: {
    type: Number,
    default: 1,
    min: [1, 'Minimum students must be at least 1'],
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Creates relationship to User model
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lesson', lessonSchema);