const User = require('../models/User');
const { generateTokenPair, generateEmailVerificationToken } = require('../utils/jwt');
const { sendOTPEmail } = require('../utils/email');

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
            message: 'User registered successfully. Please check your email for OTP verification.'
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

        res.json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete login.',
            data: {
                email: user.email,
                otpInfo: {
                    sent: emailResult.success,
                    expiresIn: '10 minutes',
                    message: emailResult.success ? 'Check your email for OTP' : 'OTP not sent to email, check console'
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};


const verifyOTPCode = async (req, res) => {
    try {
        const { email, otp, type } = req.body;
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

        // Auto-detect verification type if not provided
        let verificationType = type;
        if (!verificationType) {
            // If user is already email verified and has recent OTP, it's likely login
            if (user.isEmailVerified && user.otp && user.otp.expires > new Date()) {
                verificationType = 'login';
            } else if (!user.isEmailVerified) {
                verificationType = 'signup';
            } else {
                verificationType = 'login'; // Default to login for verified users
            }
        }

        // Handle different types of OTP verification
        if (verificationType === 'login') {
            // For login: return JWT token and user data
            const tokens = generateTokenPair(user._id, user.email, user.role);

            res.json({
                success: true,
                message: 'Login successful. OTP verified.',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName || null,
                        isEmailVerified: user.isEmailVerified,
                        role: user.role,
                        lastLogin: user.lastLogin
                    },
                    token: tokens.token,
                    expiresIn: tokens.expiresIn
                }
            });
        } else if (verificationType === 'signup') {
            // For signup: mark email as verified
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            res.json({
                success: true,
                message: 'User registered successfully. Please check your email for OTP verification.',
                data: {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    requiresVerification: false
                }
            });
        } else if (verificationType === 'forgot-password') {
            // For forgot password: just verify OTP
            res.json({
                success: true,
                message: 'OTP verified successfully. You can now reset your password.',
                data: { email: user.email, verified: true }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid verification type. Use: signup, login, or forgot-password' });
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email, type = 'signup' } = req.body; // type: signup | login | forgot-password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate new OTP - allow resending unlimited times for all types
        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to resend OTP to ${email} for ${type}...`);
        const emailResult = await sendOTPEmail(email, otp);

        if (emailResult.success) {
            console.log(`✅ OTP resent successfully to ${email} for ${type}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        // Different messages based on type
        let message = '';
        switch (type) {
            case 'signup':
                message = emailResult.success ? 'Verification OTP resent to your email successfully' : 'Verification OTP regenerated successfully. Check console for OTP.';
                break;
            case 'login':
                message = emailResult.success ? 'Login OTP resent to your email successfully' : 'Login OTP regenerated successfully. Check console for OTP.';
                break;
            case 'forgot-password':
                message = emailResult.success ? 'Password reset OTP resent to your email successfully' : 'Password reset OTP regenerated successfully. Check console for OTP.';
                break;
            default:
                message = emailResult.success ? 'OTP resent to your email successfully' : 'OTP regenerated successfully. Check console for OTP.';
        }

        res.json({
            success: true,
            message: message,
            data: {
                email: user.email,
                otpExpiresIn: '10 minutes',
                emailSent: emailResult.success,
                type,
                purpose: type === 'signup' ? 'Email verification' :
                    type === 'login' ? 'Login verification' :
                        type === 'forgot-password' ? 'Password reset' : 'OTP verification'
            }
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

        // Generate OTP for password reset
        const otp = user.generateOTP();
        await user.save();

        console.log(`📧 Attempting to send password reset OTP to ${email}...`);
        const emailResult = await sendOTPEmail(email, otp);

        if (emailResult.success) {
            console.log(`✅ Password reset OTP email sent successfully to ${email}`);
        } else {
            console.log(`❌ Email sending failed. OTP shown in console above.`);
            console.log(`🔧 Check your email credentials in .env file`);
        }

        res.json({
            success: true,
            message: 'Password reset OTP sent to your email',
            data: {
                email: user.email,
                otpExpiresIn: '10 minutes',
                emailSent: emailResult.success,
                message: emailResult.success ? 'Check your email for OTP' : 'OTP not sent to email, check console'
            }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to process password reset request', error: error.message });
    }
};


const verifyPasswordResetOTP = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otpResult = await user.verifyOTP(otp);
        if (!otpResult.valid) {
            return res.status(400).json({ success: false, message: otpResult.message });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            });
        }

        // Update password
        user.password = password;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: {
                email: user.email,
                verified: true,
                passwordReset: true
            }
        });
    } catch (error) {
        console.error('Password reset OTP verification error:', error);
        res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
    }
};


module.exports = {
    signup,
    login,
    verifyOTPCode,
    resendOTP,
    logout,
    forgotPassword,
    verifyPasswordResetOTP
};