const User = require('../models/User');
const { generateTokenPair, generateEmailVerificationToken } = require('../utils/jwt');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail, testEmailConfig } = require('../utils/email');

const signup = async (req, res) => {
    try {
        const { email, password, firstName } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }
        const user = new User({ email, password, firstName });
        const emailVerificationToken = generateEmailVerificationToken(user._id, email);
        user.emailVerificationToken = emailVerificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to send OTP to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp);

        if (emailResult.success) {
            console.log(`✅ OTP email sent successfully to ${email}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for OTP verification.',
            data: { userId: user._id, email: user.email, firstName: user.firstName || null, requiresVerification: true }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (user.isAccountLocked()) {
            return res.status(403).json({ success: false, message: `Account locked. Try again in ${Math.ceil((user.lockUntil - Date.now()) / 60000)} minutes.` });
        }

        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to send login OTP to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp);

        if (emailResult.success) {
            console.log(`✅ Login OTP email sent successfully to ${email}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        await user.resetLoginAttempts();
        user.lastLogin = new Date();
        await user.save();
        const tokens = generateTokenPair(user._id, user.email, user.role);

        res.json({
            success: true,
            message: 'Login successful. OTP sent to your email for additional security.',
            data: {
                user: { id: user._id, email: user.email, firstName: user.firstName || null, isEmailVerified: user.isEmailVerified, role: user.role, lastLogin: user.lastLogin },
                token: tokens.token,
                expiresIn: tokens.expiresIn,
                otpInfo: { sent: emailResult.success, expiresIn: '10 minutes', message: emailResult.success ? 'Check your email for OTP' : 'OTP not sent to email, check console' }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to send verification OTP to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp);
        const emailSent = emailResult.success;

        if (emailResult.success) {
            console.log(`✅ Verification OTP email sent successfully to ${email}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        res.json({
            success: true,
            message: emailSent ? 'OTP sent to your email successfully' : 'OTP generated successfully. Check console for OTP.',
            data: { email: user.email, otpExpiresIn: '10 minutes', emailSent: emailSent }
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    }
};

const verifyOTPCode = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otpResult = await user.verifyOTP(otp);
        if (!otpResult.valid) {
            return res.status(400).json({ success: false, message: otpResult.message });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        try {
            await sendWelcomeEmail(email, user.firstName);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: { userId: user._id, email: user.email, isEmailVerified: user.isEmailVerified }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to resend OTP to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp);

        if (emailResult.success) {
            console.log(`✅ OTP resent successfully to ${email}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        res.json({
            success: true,
            message: emailResult.success ? 'OTP resent to your email successfully' : 'OTP regenerated successfully. Check console for OTP.',
            data: { email: user.email, otpExpiresIn: '10 minutes', emailSent: emailResult.success }
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ success: false, message: 'Failed to resend OTP', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Logout successful',
            data: { timestamp: new Date() }
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, message: 'Logout failed', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found with this email address' });
        }
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        const emailResult = await sendPasswordResetEmail(email, resetToken, user.firstName);

        if (!emailResult.success) {
            console.log(`📧 Password reset email sending failed. Reset token for ${email}: ${resetToken}`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        res.json({
            success: true,
            message: 'Password reset instructions sent to your email',
            data: { email: user.email, resetToken: emailResult.success ? undefined : resetToken, emailSent: emailResult.success, expiresIn: '15 minutes' }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to process password reset request', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }
        user.password = password;
        user.clearPasswordResetToken();
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: { email: user.email, message: 'You can now login with your new password' }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
    }
};

const testEmail = async (req, res) => {
    try {
        const result = await testEmailConfig();
        res.json({ success: result.success, message: result.message, data: { config: result.config, timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({ success: false, message: 'Email test failed', error: error.message });
    }
};

module.exports = {
    signup,
    login,
    verifyOTP,
    verifyOTPCode,
    resendOTP,
    logout,
    forgotPassword,
    resetPassword,
    testEmail
};