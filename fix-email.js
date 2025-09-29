#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 FixedfloatWallet Email Configuration Fixer\n');

// Check current configuration
console.log('📋 Current Configuration:');
console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Not set'}`);
console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set'}`);
console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || '587'}`);
console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'noreply@fixedfloat.com'}\n`);

// Test different email configurations
const emailConfigs = [
    {
        name: 'Gmail (Current)',
        config: {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }
    },
    {
        name: 'Gmail (Alternative)',
        config: {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }
    },
    {
        name: 'Outlook',
        config: {
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }
    }
];

async function testEmailConfig(config, name) {
    try {
        console.log(`🧪 Testing ${name}...`);
        
        const transporter = nodemailer.createTransport(config);
        
        // Verify connection
        await transporter.verify();
        console.log(`✅ ${name}: Connection successful!`);
        
        // Send test email
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@fixedfloat.com',
            to: process.env.EMAIL_USER,
            subject: 'FixedfloatWallet API - Email Test',
            html: `
                <h2>🎉 Email Configuration Successful!</h2>
                <p>Your FixedfloatWallet API email is working correctly.</p>
                <p><strong>Configuration:</strong> ${name}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <p><em>This is a test email from your API.</em></p>
            `
        });
        
        console.log(`📧 ${name}: Test email sent successfully!`);
        console.log(`📬 Message ID: ${info.messageId}\n`);
        return true;
        
    } catch (error) {
        console.log(`❌ ${name}: Failed`);
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

async function main() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ EMAIL_USER or EMAIL_PASS not set in .env file');
        console.log('\n📝 Please add to your .env file:');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASS=your-app-password');
        console.log('\n📖 See EMAIL_SETUP_GUIDE.md for detailed instructions');
        return;
    }

    console.log('🚀 Testing email configurations...\n');
    
    let success = false;
    for (const config of emailConfigs) {
        const result = await testEmailConfig(config.config, config.name);
        if (result) {
            success = true;
            break;
        }
    }
    
    if (success) {
        console.log('🎉 Email configuration is working!');
        console.log('✅ Your API will now send OTP emails successfully');
    } else {
        console.log('❌ All email configurations failed');
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Check EMAIL_SETUP_GUIDE.md for detailed instructions');
        console.log('2. For Gmail: Use App Password (not regular password)');
        console.log('3. Enable 2-Factor Authentication on Gmail');
        console.log('4. Try a different email provider');
        console.log('\n💡 The API works without email - OTP will be shown in console');
    }
}

main().catch(console.error);