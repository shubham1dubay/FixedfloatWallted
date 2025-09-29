#!/usr/bin/env node

const { testEmailConfig, sendOTPEmail } = require('./utils/email');
require('dotenv').config();

console.log('📧 FixedFloat Wallet - Email Setup\n');

async function setupEmail() {
    console.log('🔧 Testing Email Configuration...\n');

    // Test email configuration
    const configResult = await testEmailConfig();

    console.log('📋 Current Configuration:');
    console.log(`EMAIL_USER: ${configResult.config.EMAIL_USER}`);
    console.log(`EMAIL_PASS: ${configResult.config.EMAIL_PASS}`);
    console.log(`EMAIL_HOST: ${configResult.config.EMAIL_HOST}`);
    console.log(`EMAIL_PORT: ${configResult.config.EMAIL_PORT}`);
    console.log(`EMAIL_FROM: ${configResult.config.EMAIL_FROM}\n`);

    if (configResult.success) {
        console.log('✅ Email Configuration: WORKING');
        console.log(`📧 ${configResult.message}\n`);

        // Test sending OTP email
        console.log('🧪 Testing OTP Email...');
        const testEmail = 'test@example.com';
        const testOTP = '123456';
        const testName = 'Test User';

        const emailResult = await sendOTPEmail(testEmail, testOTP, testName, 'verification');

        if (emailResult.success) {
            console.log('✅ OTP Email: SENT SUCCESSFULLY');
            console.log(`📬 Message ID: ${emailResult.messageId}`);
            console.log('🎉 Your email system is working perfectly!');
        } else {
            console.log('❌ OTP Email: FAILED');
            console.log(`🔍 Reason: ${emailResult.reason}`);
            if (emailResult.error) {
                console.log(`❌ Error: ${emailResult.error}`);
            }
        }

    } else {
        console.log('❌ Email Configuration: FAILED');
        console.log(`📧 ${configResult.message}\n`);

        console.log('🔧 QUICK FIX:');
        console.log('1. Open your .env file');
        console.log('2. Add these lines:');
        console.log('');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASS=your-app-password');
        console.log('EMAIL_FROM=noreply@fixedfloat.com');
        console.log('');
        console.log('3. For Gmail:');
        console.log('   - Go to: https://myaccount.google.com/security');
        console.log('   - Enable 2-Step Verification');
        console.log('   - Generate App Password');
        console.log('   - Use App Password as EMAIL_PASS');
        console.log('');
        console.log('4. Run this script again: node setup-email-simple.js');
    }

    console.log('\n🚀 After setup, your API will send OTP to email!');
    console.log('📧 Test with: curl -X POST http://localhost:3000/api/auth/signup \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"email": "test@example.com", "password": "SecurePass123!", "firstName": "Test"}\'');
}

setupEmail().catch(console.error);