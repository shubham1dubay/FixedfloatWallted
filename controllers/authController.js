const User = require('../models/User');
const { generateTokenPair, generateEmailVerificationToken } = require('../utils/jwt');
const { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail, testEmailConfig } = require('../utils/email');

// @desc    Register a new user
// @access  Public
const signup = async (req, res) => {
    try {
        const { email, password, firstName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = new User({
            email,
            password,
            firstName
        });

        // Generate email verification token
        const emailVerificationToken = generateEmailVerificationToken(user._id, email);
        user.emailVerificationToken = emailVerificationToken;
        user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await user.save();

        // Generate OTP for email verification
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, firstName, 'verification');
        if (!emailResult.success) {
            if (emailResult.reason === 'not_configured') {
                console.log(`📧 Email not configured. OTP shown in console above.`);
            } else {
                console.log(`📧 Email sending failed. OTP shown in console above.`);
            }
        }

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for OTP verification.',
            data: {
                userId: user._id,
                email: user.email,
                firstName: user.firstName || null,
                requiresVerification: true
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// @desc    Login user
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isAccountLocked()) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to too many failed login attempts'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Always generate and send OTP (for security)
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, user.firstName, 'login');
        if (!emailResult.success) {
            if (emailResult.reason === 'not_configured') {
                console.log(`📧 Email not configured. OTP shown in console above.`);
            } else {
                console.log(`📧 Email sending failed. OTP shown in console above.`);
            }
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const tokens = generateTokenPair(user._id, user.email, user.role);

        res.json({
            success: true,
            message: 'Login successful. OTP sent to your email for additional security.',
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
                expiresIn: tokens.expiresIn,
                otpInfo: {
                    sent: true,
                    expiresIn: '10 minutes',
                    message: 'Check your email for OTP'
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// @desc    Auto-generate and send OTP for email verification
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, user.firstName, 'verification');
        const emailSent = emailResult.success;

        res.json({
            success: true,
            message: emailSent ? 'OTP sent to your email successfully' : 'OTP generated successfully. Check console for OTP.',
            data: {
                email: user.email,
                otpExpiresIn: '10 minutes',
                emailSent: emailSent
            }
        });
    } catch (error) {
        console.error('OTP generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate and send OTP',
            error: error.message
        });
    }
};

// @desc    Verify the OTP code
// @access  Public
const verifyOTPCode = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify OTP
        const otpResult = await user.verifyOTP(otp);
        if (!otpResult.valid) {
            return res.status(400).json({
                success: false,
                message: otpResult.message
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        try {
            await sendWelcomeEmail(email, user.firstName);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the verification if email fails
        }

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: {
                userId: user._id,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'OTP verification failed',
            error: error.message
        });
    }
};

// @desc    Resend OTP for email verification
// @access  Public
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        try {
            await sendOTPEmail(email, otp, user.firstName);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email'
            });
        }

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP',
            error: error.message
        });
    }
};

// @desc    Logout user (client-side token removal)
// @access  Private
const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Forgot password - Send reset token
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email address'
            });
        }

        // Generate password reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken, user.firstName);

        if (!emailResult.success) {
            if (emailResult.reason === 'not_configured') {
                console.log(`📧 Email not configured. Reset token for ${email}: ${resetToken}`);
            } else {
                console.log(`📧 Email sending failed. Reset token for ${email}: ${resetToken}`);
            }
        }

        res.json({
            success: true,
            message: 'Password reset instructions sent to your email',
            data: {
                email: user.email,
                resetToken: emailResult.success ? undefined : resetToken, // Only show token if email failed
                emailSent: emailResult.success,
                expiresIn: '15 minutes'
            }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request',
            error: error.message
        });
    }
};

// @desc    Reset password with token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Find user by reset token
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.clearPasswordResetToken();
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully',
            data: {
                email: user.email,
                message: 'You can now login with your new password'
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
};

// @desc    Test email configuration
// @access  Public
const testEmail = async (req, res) => {
    try {
        const result = await testEmailConfig();

        res.json({
            success: result.success,
            message: result.message,
            data: {
                config: result.config,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({
            success: false,
            message: 'Email test failed',
            error: error.message
        });
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