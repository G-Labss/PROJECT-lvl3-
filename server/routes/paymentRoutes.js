const express = require('express');
const router = express.Router();
const { createZelleBooking } = require('../controllers/paymentController');

router.post('/zelle', createZelleBooking);

module.exports = router;
