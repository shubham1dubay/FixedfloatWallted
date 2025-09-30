const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    validateSignup,
    validateLogin,
    validateOTP,
    validateForgotPassword
} = require('../middleware/validation');
const {
    signup,
    login,
    verifyOTPCode,
    resendOTP,
    logout,
    forgotPassword,
    verifyPasswordResetOTP
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/verify-otp', validateOTP, verifyOTPCode);
router.post('/resend-otp', resendOTP);
router.post('/logout', authenticateToken, logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/verify-password-reset-otp', validateOTP, verifyPasswordResetOTP);

module.exports = router;