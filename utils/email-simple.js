const nodemailer = require('nodemailer');

// Simple email configuration that works with regular passwords
const createSimpleTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        return null;
    }

    // Try different configurations based on email provider
    if (emailUser.includes('@gmail.com')) {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
        return nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });
    }

    if (emailUser.includes('@yahoo.com')) {
        return nodemailer.createTransport({
            host: 'smtp.mail.yahoo.com',
            port: 587,
            secure: false,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });
    }

    // Default SMTP configuration
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send OTP email with simple configuration
const sendSimpleOTPEmail = async (email, otp, firstName = 'User') => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`⚠️  Email not configured. OTP for ${email}: ${otp}`);
            return { success: false, reason: 'not_configured' };
        }

        const transporter = createSimpleTransporter();
        if (!transporter) {
            console.log(`❌ Failed to create email transporter. OTP for ${email}: ${otp}`);
            return { success: false, reason: 'transporter_failed' };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@fixedfloat.com',
            to: email,
            subject: 'Your OTP - FixedFloat Wallet',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FixedFloat Wallet</h1>
          </div>
          
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Hello ${firstName}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your One-Time Password (OTP) for FixedFloat Wallet:
            </p>
            
            <div style="background: #f8f9fa; border: 2px solid #667eea; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace; font-weight: bold;">
                ${otp}
              </h1>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 25px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                ⏰ This OTP will expire in <strong>10 minutes</strong>
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${email} successfully:`, result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        console.log(`🔐 OTP for ${email}: ${otp}`);
        return { success: false, reason: 'send_failed', error: error.message };
    }
};

module.exports = {
    sendSimpleOTPEmail
};