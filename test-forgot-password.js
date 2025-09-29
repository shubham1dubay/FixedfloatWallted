#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function testForgotPassword() {
    console.log('🔐 FixedFloat Wallet - Forgot Password Test\n');

    try {
        // Test 1: Forgot Password
        console.log('1️⃣  Testing Forgot Password...');
        const forgotPasswordData = {
            email: 'test@example.com'
        };

        try {
            const forgotResponse = await axios.post(`${BASE_URL}/forgot-password`, forgotPasswordData);
            console.log('✅ Forgot Password Success:', forgotResponse.data.message);
            console.log('📧 Email:', forgotResponse.data.data.email);
            console.log('📧 Email Sent:', forgotResponse.data.data.emailSent);
            console.log('⏰ Expires In:', forgotResponse.data.data.expiresIn);

            if (forgotResponse.data.data.resetToken) {
                console.log('🔐 Reset Token (if email failed):', forgotResponse.data.data.resetToken);
            }
        } catch (error) {
            console.log('❌ Forgot Password Failed:', error.response?.data?.message || error.message);
        }
        console.log('');

        // Test 2: Reset Password (with sample token)
        console.log('2️⃣  Testing Reset Password...');
        const resetPasswordData = {
            token: 'sample-token-123',
            password: 'NewSecurePass123!'
        };

        try {
            const resetResponse = await axios.post(`${BASE_URL}/reset-password`, resetPasswordData);
            console.log('✅ Reset Password Success:', resetResponse.data.message);
            console.log('📧 Email:', resetResponse.data.data.email);
        } catch (error) {
            console.log('❌ Reset Password Failed:', error.response?.data?.message || error.message);
        }
        console.log('');

        console.log('📝 Complete Forgot Password Flow:');
        console.log('1. User requests password reset:');
        console.log('   curl -X POST http://localhost:3000/api/auth/forgot-password \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"email": "user@example.com"}\'');
        console.log('');
        console.log('2. User receives email with reset token');
        console.log('3. User resets password:');
        console.log('   curl -X POST http://localhost:3000/api/auth/reset-password \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"token": "reset-token", "password": "NewPassword123!"}\'');
        console.log('');
        console.log('4. User can login with new password');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testForgotPassword();