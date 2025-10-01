const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    otp: {
        code: String,
        expires: Date,
        attempts: { type: Number, default: 0 }
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordResetVerified: { type: Boolean, default: false },
    passwordResetVerifiedAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    lastLogin: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Index for performance
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function () {
    const otpLength = parseInt(process.env.OTP_LENGTH) || 6;
    const otpExpiresIn = process.env.OTP_EXPIRES_IN || '10m';

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    const timeUnit = otpExpiresIn.slice(-1);
    const timeValue = parseInt(otpExpiresIn.slice(0, -1));

    switch (timeUnit) {
        case 'm': expires.setMinutes(expires.getMinutes() + timeValue); break;
        case 'h': expires.setHours(expires.getHours() + timeValue); break;
        case 'd': expires.setDate(expires.getDate() + timeValue); break;
        default: expires.setMinutes(expires.getMinutes() + 10);
    }

    this.otp = { code: otp, expires: expires, attempts: 0 };
    return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = async function (otp) {
    if (!this.otp || !this.otp.code || !this.otp.expires) {
        return { valid: false, message: 'No OTP found' };
    }

    if (this.otp.expires < new Date()) {
        return { valid: false, message: 'OTP has expired' };
    }

    if (this.otp.attempts >= 3) {
        return { valid: false, message: 'Too many OTP attempts' };
    }

    if (this.otp.code !== otp) {
        this.otp.attempts += 1;
        await this.save();
        return { valid: false, message: 'Invalid OTP' };
    }

    this.otp = undefined;
    await this.save();
    return { valid: true, message: 'OTP verified successfully' };
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
    return this.isLocked;
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.passwordResetToken = resetToken;
    this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return resetToken;
};

// Method to clear password reset token
userSchema.methods.clearPasswordResetToken = function () {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
};

module.exports = mongoose.model('User', userSchema);