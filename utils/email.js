const nodemailer = require('nodemailer');

// Email configuration with multiple providers
const getEmailConfig = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return null;
  }

  // Gmail configuration
  if (emailUser.includes('@gmail.com')) {
    return {
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    };
  }

  // Outlook configuration
  if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
    return {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    };
  }

  // Yahoo configuration
  if (emailUser.includes('@yahoo.com')) {
    return {
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    };
  }

  // Custom SMTP configuration
  return {
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
  };
};

// Create email transporter
const createTransporter = () => {
  const config = getEmailConfig();

  if (!config) {
    return null;
  }

  try {
    return nodemailer.createTransport(config);
  } catch (error) {
    console.error('Error creating email transporter:', error.message);
    return null;
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp, firstName = 'User', type = 'verification') => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured. OTP for ${email}: ${otp}`);
      console.log(`⏰ OTP expires in 10 minutes`);
      console.log(`📧 To enable email, set EMAIL_USER and EMAIL_PASS in .env file`);
      console.log(`🔧 Run: npm run setup-email-complete`);
      return { success: false, reason: 'not_configured' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log(`❌ Failed to create email transporter. OTP for ${email}: ${otp}`);
      return { success: false, reason: 'transporter_failed' };
    }

    // Verify transporter connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError.message);
      console.log(`🔐 OTP for ${email}: ${otp}`);
      return { success: false, reason: 'verification_failed', error: verifyError.message };
    }

    const subject = type === 'login'
      ? 'Your Login OTP - FixedFloat Wallet'
      : 'Your Verification OTP - FixedFloat Wallet';

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fixedfloat.com',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FixedFloat Wallet</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Secure Digital Wallet</p>
          </div>
          
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Hello ${firstName}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${type === 'login'
          ? 'You requested a One-Time Password (OTP) for logging into your FixedFloat Wallet account.'
          : 'You requested a One-Time Password (OTP) for verifying your FixedFloat Wallet account.'
        }
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Use the following code to complete your ${type === 'login' ? 'login' : 'verification'}:
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
              If you didn't request this code, please ignore this email or contact our support team.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 FixedFloat Wallet. All rights reserved.
              </p>
            </div>
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
    console.log(`⏰ OTP expires in 10 minutes`);
    return { success: false, reason: 'send_failed', error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured. Welcome email for ${email} not sent.`);
      return { success: false, reason: 'not_configured' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log(`❌ Failed to create email transporter for welcome email.`);
      return { success: false, reason: 'transporter_failed' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fixedfloat.com',
      to: email,
      subject: 'Welcome to FixedFloat Wallet! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to FixedFloat Wallet! 🎉</h1>
          </div>
          
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Hello ${firstName}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Welcome to FixedFloat Wallet! Your account has been successfully created and verified.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              You can now start using all the features of our secure wallet platform.
            </p>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; text-align: left; margin: 0; padding-left: 20px;">
                <li>Complete your profile setup</li>
                <li>Add your first wallet</li>
                <li>Explore our security features</li>
                <li>Start making transactions</li>
              </ul>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                🚀 Go to Dashboard
              </a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you have any questions, feel free to contact our support team.
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 FixedFloat Wallet. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${email} successfully:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    return { success: false, reason: 'send_failed', error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return {
        success: false,
        message: 'Email not configured. Set EMAIL_USER and EMAIL_PASS in .env file.',
        config: {
          EMAIL_USER: 'Not set',
          EMAIL_PASS: 'Not set',
          EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
          EMAIL_PORT: process.env.EMAIL_PORT || '587',
          EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@fixedfloat.com'
        }
      };
    }

    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        message: 'Failed to create email transporter.',
        config: {
          EMAIL_USER: process.env.EMAIL_USER,
          EMAIL_PASS: 'Set',
          EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
          EMAIL_PORT: process.env.EMAIL_PORT || '587',
          EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@fixedfloat.com'
        }
      };
    }

    // Test connection
    await transporter.verify();

    return {
      success: true,
      message: 'Email configuration is working correctly!',
      config: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: 'Set',
        EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
        EMAIL_PORT: process.env.EMAIL_PORT || '587',
        EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@fixedfloat.com'
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Email configuration failed: ${error.message}`,
      config: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: 'Set',
        EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
        EMAIL_PORT: process.env.EMAIL_PORT || '587',
        EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@fixedfloat.com'
      }
    };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, firstName = 'User') => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`⚠️  Email not configured. Password reset token for ${email}: ${resetToken}`);
      console.log(`⏰ Token expires in 15 minutes`);
      console.log(`📧 To enable email, set EMAIL_USER and EMAIL_PASS in .env file`);
      return { success: false, reason: 'not_configured' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log(`❌ Failed to create email transporter for password reset.`);
      return { success: false, reason: 'transporter_failed' };
    }

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fixedfloat.com',
      to: email,
      subject: 'Reset Your Password - FixedFloat Wallet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">FixedFloat Wallet</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 40px; background: #ffffff;">
            <h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Hello ${firstName}! 👋</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              You requested to reset your password for your FixedFloat Wallet account.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to reset your password:
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        display: inline-block; 
                        font-weight: bold;
                        font-size: 16px;">
                🔐 Reset Password
              </a>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Reset Token:</h3>
              <p style="color: #666; font-size: 14px; font-family: 'Courier New', monospace; background: #fff; padding: 10px; border-radius: 4px; margin: 0; word-break: break-all;">
                ${resetToken}
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 25px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                ⏰ This link will expire in <strong>15 minutes</strong>
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
              If you didn't request this password reset, please ignore this email or contact our support team.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 FixedFloat Wallet. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${email} successfully:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    console.log(`🔐 Reset token for ${email}: ${resetToken}`);
    console.log(`⏰ Token expires in 15 minutes`);
    return { success: false, reason: 'send_failed', error: error.message };
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  testEmailConfig
};