const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  initials: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
