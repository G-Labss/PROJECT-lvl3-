const { Router } = require("express");

const lessonRoutes = require('./lessonRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');
const discountRoutes = require('./discountRoutes');
const bookingRoutes = require('./bookingRoutes');
const paymentRoutes = require('./paymentRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const progressRoutes = require('./progressRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/lessons', lessonRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);
router.use('/discounts', discountRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/availability', availabilityRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/progress', progressRoutes);

module.exports = router;
