const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: 1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, role, text, rating } = req.body;
    if (!name || !role || !text) return res.status(400).json({ message: 'Name, role, and text are required' });
    const initials = name.trim().split(' ').map(w => w[0].toUpperCase()).join('').slice(0, 2);
    const testimonial = await Testimonial.create({ name, role, text, rating: rating || 5, initials });
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create testimonial' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete testimonial' });
  }
});

module.exports = router;
