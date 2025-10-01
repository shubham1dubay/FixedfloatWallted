// Temporary storage for pending signups
// In production, you might want to use Redis or a database for this

const pendingSignups = new Map();

// Store pending signup data
function storePendingSignup(email, userData, otp, expires) {
    pendingSignups.set(email, {
        userData,
        otp: {
            code: otp,
            expires: expires,
            attempts: 0
        },
        createdAt: new Date()
    });
}

// Get pending signup data
function getPendingSignup(email) {
    return pendingSignups.get(email);
}

// Remove pending signup data
function removePendingSignup(email) {
    pendingSignups.delete(email);
}

// Clean up expired pending signups (call this periodically)
function cleanupExpiredSignups() {
    const now = new Date();
    for (const [email, data] of pendingSignups.entries()) {
        if (data.otp.expires < now) {
            pendingSignups.delete(email);
        }
    }
}

// Verify OTP for pending signup
function verifyPendingOTP(email, otp) {
    const data = pendingSignups.get(email);
    if (!data) {
        return { valid: false, message: 'No pending signup found' };
    }

    if (data.otp.expires < new Date()) {
        pendingSignups.delete(email);
        return { valid: false, message: 'OTP has expired' };
    }

    if (data.otp.attempts >= 3) {
        pendingSignups.delete(email);
        return { valid: false, message: 'Too many OTP attempts' };
    }

    if (data.otp.code !== otp) {
        data.otp.attempts += 1;
        return { valid: false, message: 'Invalid OTP' };
    }

    return { valid: true, message: 'OTP verified successfully', userData: data.userData };
}

module.exports = {
    storePendingSignup,
    getPendingSignup,
    removePendingSignup,
    cleanupExpiredSignups,
    verifyPendingOTP
};