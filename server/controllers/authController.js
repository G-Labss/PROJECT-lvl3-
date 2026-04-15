const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtUtil = require("../utils/jwtUtil.js");

const config = require("../config/config.js");
const User = require('../models/User.js');
const Token = require('../models/Token.js');

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // bcrypt.compare

    const attempt = await User.findOne({
      email,
      // password: hashedPassword 
    });

    if (!attempt) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, attempt.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const tokenExists = await Token.findOne({ userId: attempt._id });

    if (tokenExists) {
      await Token.deleteOne({ _id: tokenExists._id });
    }


    const tokens = jwtUtil.generateTokens({ id: attempt._id, email: attempt.email, role: attempt.role });

    const tokenDoc = new Token({
      userId: attempt._id,
      refreshToken: tokens.refreshToken,
    })

    await tokenDoc.save();

    res.status(200).json({ ...tokens, role: attempt.role, name: attempt.name })

    // const token = jwt.sign(
    //   { id: 'admin', email: email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' }
    // );

    // res.status(200).json({
    //   success: true,
    //   token,
    //   user: { email: email },
    // });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    // pick refresh token from params;
    const { refreshToken } = req.params;

    // if refresh token is not provided. throw error
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    // look for token doc linked to user
    const tokenDoc = await Token.findOne({ refreshToken });

    // if none is provided. throw error
    if (!tokenDoc) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const decoded = jwtUtil.verifyRefreshToken(refreshToken)

    if (!decoded) {
      await Token.deleteOne({ _id: tokenDoc._id });
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    // if (tokenDoc.expiresAt < new Date()) {
    //   await Token.deleteOne({ _id: tokenDoc._id });
    //   return res.status(401).json({ success: false, message: 'Refresh token expired' });
    // }

    const user = await User.findById(tokenDoc.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const tokens = jwtUtil.generateTokens({ id: user._id, email: user.email, role: user.role });

    const newTokenDoc = new Token({
      userId: user._id,
      refreshToken: tokens.refreshToken,
    })

    await newTokenDoc.save();

    await Token.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({ ...tokens, role: user.role, name: user.name });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, role: 'player' });

    const tokens = jwtUtil.generateTokens({ id: user._id, email: user.email, role: user.role });

    const tokenDoc = new Token({ userId: user._id, refreshToken: tokens.refreshToken });
    await tokenDoc.save();

    res.status(201).json({ ...tokens, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  login,
  refreshToken,
  register,
}
