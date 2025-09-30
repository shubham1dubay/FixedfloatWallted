const nodemailer = require('nodemailer');

// OTP email function - only email functionality needed
async function sendOTPEmail(toEmail, otp) {
  // Create a transporter using your email service credentials
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // replace with your email
      pass: process.env.EMAIL_PASS || 'your-app-password'   // replace with your app password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email options
  let mailOptions = {
    from: `"FixedFloat Wallet" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
    to: toEmail,
    subject: 'Your OTP Code - FixedFloat Wallet',
    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <h1 style="color: #333;">FixedFloat Wallet</h1>
                      </div>
                      <div style="padding: 20px 0;">
                        <p style="font-size: 16px; color: #333;">Hello,</p>
                        <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for FixedFloat Wallet is:</p>
                        <div style="text-align: center; margin: 30px 0;">
                          <span style="font-size: 28px; font-weight: bold; color: #007bff; background-color: #f0f8ff; padding: 15px 25px; border-radius: 8px; letter-spacing: 2px;">${otp}</span>
                        </div>
                        <p style="font-size: 16px; color: #333;">This OTP is valid for 10 minutes.</p>
                        <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
                      </div>
                      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
                        <p>&copy; 2024 FixedFloat Wallet. All rights reserved.</p>
                      </div>
                    </div>
                  `
  };

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail
};