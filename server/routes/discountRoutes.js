const express = require('express');
const router = express.Router();
const { validateDiscount } = require('../utils/discountHelper');

router.post('/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Code is required' });
  }
  const discount = validateDiscount(code);
  if (!discount) {
    return res.status(404).json({ success: false, message: 'Invalid discount code' });
  }
  res.status(200).json({ success: true, discount });
});

module.exports = router;
