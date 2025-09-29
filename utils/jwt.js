const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '24h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
};

// Verify JWT token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

// Generate single token
const generateTokenPair = (userId, email, role = 'user') => {
    const payload = { userId, email, role };

    return {
        token: generateToken(payload),
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
};

// Generate email verification token
const generateEmailVerificationToken = (userId, email) => {
    return jwt.sign(
        { userId, email, type: 'email_verification' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    generateTokenPair,
    generateEmailVerificationToken
};