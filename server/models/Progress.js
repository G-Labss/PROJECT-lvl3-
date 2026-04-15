const mongoose = require('mongoose');

const ntrpEntrySchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1.0, max: 7.0 },
  note: { type: String, trim: true, default: '' },
  date: { type: Date, default: Date.now },
});

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  achievedAt: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  studentName: { type: String, trim: true, default: '' },
  strokeRatings: {
    forehand:   { type: Number, min: 0, max: 10, default: 0 },
    backhand:   { type: Number, min: 0, max: 10, default: 0 },
    serve:      { type: Number, min: 0, max: 10, default: 0 },
    volley:     { type: Number, min: 0, max: 10, default: 0 },
    footwork:   { type: Number, min: 0, max: 10, default: 0 },
    mentalGame: { type: Number, min: 0, max: 10, default: 0 },
  },
  ntrpHistory: [ntrpEntrySchema],
  notes: [noteSchema],
  milestones: [milestoneSchema],
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
