const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["player", "coach", "admin"],
    required: [true, 'Role is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  ntrpRating: {
    type: Number,
    min: [1.0, 'NTRP rating must be between 1.0 and 7.0'],
    max: [7.0, 'NTRP rating must be between 1.0 and 7.0'],
  },
  yearsExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
  },
  specialties: [{
    type: String,
    trim: true,
  }],
  serviceArea: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    // this.password = require('bcrypt').hashSync(this.password, 10);
    this.password = await bcrypt.hashSync(this.password, 10);
  }
});

module.exports = mongoose.model('User', userSchema);