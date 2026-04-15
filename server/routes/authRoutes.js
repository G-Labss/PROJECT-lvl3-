const express = require('express');
const router = express.Router();
const { login, refreshToken, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.get("/refresh-token/:refreshToken", refreshToken)

module.exports = router;
