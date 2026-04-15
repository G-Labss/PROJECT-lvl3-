const jwt = require('jsonwebtoken');

const config = require("../config/config.js");

const generateToken = (payload) => jwt.sign(payload, config.tokenSecret, { expiresIn: '1h' });

const generateRefreshToken = (payload) => jwt.sign(payload, config.refreshTokenSecret, { expiresIn: '7d' });

const generateTokens = (payload) => {
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { token, refreshToken };
}

const verifyToken = (token) => jwt.verify(token, config.tokenSecret);

const verifyRefreshToken = (token) => jwt.verify(token, config.refreshTokenSecret);

module.exports = {
    generateTokens,
    verifyToken,
    verifyRefreshToken
};
