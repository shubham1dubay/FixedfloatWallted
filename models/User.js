const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't include password in queries by default
    },
    firstName: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        select: false
    },
    emailVerificationExpires: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    otp: {
        code: {
            type: String,
            select: false
        },
        expires: {
            type: Date,
            select: false
        },
        attempts: {
            type: Number,
            default: 0,
            select: false
        }
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false
    },
    lockUntil: {
        type: Date,
        select: false
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if account is locked
userSchema.methods.isAccountLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockTime = parseInt(process.env.LOCKOUT_TIME) || 30 * 60 * 1000; // 30 minutes

    // If we have reached max attempts and it's not locked already, lock the account
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }

    return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Instance method to generate OTP
userSchema.methods.generateOTP = function () {
    const otpLength = parseInt(process.env.OTP_LENGTH) || 6;
    const otpExpiresIn = process.env.OTP_EXPIRES_IN || '10m';

    // Generate random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time
    const expires = new Date();
    const timeUnit = otpExpiresIn.slice(-1);
    const timeValue = parseInt(otpExpiresIn.slice(0, -1));

    switch (timeUnit) {
        case 'm':
            expires.setMinutes(expires.getMinutes() + timeValue);
            break;
        case 'h':
            expires.setHours(expires.getHours() + timeValue);
            break;
        case 'd':
            expires.setDate(expires.getDate() + timeValue);
            break;
        default:
            expires.setMinutes(expires.getMinutes() + 10); // Default 10 minutes
    }

    this.otp = {
        code: otp,
        expires: expires,
        attempts: 0
    };

    return otp;
};

// Instance method to verify OTP
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

    // Clear OTP after successful verification
    this.otp = undefined;
    await this.save();

    return { valid: true, message: 'OTP verified successfully' };
};

// Instance method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    this.passwordResetToken = resetToken;
    this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return resetToken;
};

// Instance method to clear password reset token
userSchema.methods.clearPasswordResetToken = function () {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
};

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);