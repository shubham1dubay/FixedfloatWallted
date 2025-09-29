#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function debugOTP() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixedfloatwallet');
        console.log('📦 Connected to MongoDB');

        // Find user
        const email = 'otptest@example.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('👤 User found:', user.email);
        console.log('📧 Email verified:', user.isEmailVerified);
        console.log('🔐 Current OTP:', user.otp);

        if (user.otp) {
            console.log('🔐 OTP Code:', user.otp.code);
            console.log('⏰ OTP Expires:', user.otp.expires);
            console.log('🔢 OTP Attempts:', user.otp.attempts);

            // Test OTP verification
            const testResult = user.verifyOTP(user.otp.code);
            console.log('✅ OTP Test Result:', testResult);
        } else {
            console.log('❌ No OTP found in database');

            // Generate new OTP
            console.log('🔄 Generating new OTP...');
            const otp = user.generateOTP();
            await user.save();

            console.log('✅ New OTP generated:', otp);
            console.log('🔐 OTP in DB:', user.otp);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📦 Disconnected from MongoDB');
    }
}

debugOTP();