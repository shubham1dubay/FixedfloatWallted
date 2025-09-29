const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const generateTokenPair = (userId, email, role = 'user') => {
    const payload = { userId, email, role };
    return {
        token: generateToken(payload),
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
};

const generateEmailVerificationToken = (userId, email) => {
    const payload = { userId, email, type: 'email_verification' };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

module.exports = {
    generateToken,
    verifyToken,
    generateTokenPair,
    generateEmailVerificationToken
};