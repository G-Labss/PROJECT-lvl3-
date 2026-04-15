const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

exports.submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Message received! We\'ll get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
