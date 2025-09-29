const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
    validateSignup,
    validateLogin,
    validateOTP,
    validateForgotPassword,
    validateResetPassword
} = require('../middleware/validation');
const {
    signup,
    login,
    verifyOTP,
    verifyOTPCode,
    resendOTP,
    logout,
    forgotPassword,
    resetPassword,
    testEmail
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', validateSignup, signup);

router.post('/login', validateLogin, login);

router.post('/verify-otp', validateOTP, verifyOTPCode);

router.post('/send-otp', verifyOTP);

router.post('/resend-otp', resendOTP);

router.post('/logout', authenticateToken, logout);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset token to email
// @access  Public
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', validateResetPassword, resetPassword);

router.get('/test-email', testEmail);

module.exports = router;