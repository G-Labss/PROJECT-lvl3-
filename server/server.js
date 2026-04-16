require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/config');
// const lessonRoutes = require('./routes/lessonRoutes');
// const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const discountRoutes = require('./routes/discountRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const availabilityRoutes = require('./routes/availabilityRoutes');
// const testimonialRoutes = require('./routes/testimonialRoutes');

const apiRoutes = require("./routes/index.js")

const app = express();
const PORT = config.port;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/lessons', lessonRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/discounts', discountRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/availability', availabilityRoutes);
// app.use('/api/testimonials', testimonialRoutes);
app.use("/api", apiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Tennis Coach API is running with MongoDB',
    timestamp: new Date().toISOString()
  });
});

app.get("/seed", async (req, res) => {
  try {
    const seedData = require("./seedData.js");
    await seedData();
    res.json({ message: 'Data seeded successfully' });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Error seeding data', error: error.message });

  }
})

// 404 handler
app.use((req, res, next) => {
  const err = new Error(`Route not found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Error Handler (must be last)
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`🎾 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);

})
