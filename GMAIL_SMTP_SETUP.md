# Gmail SMTP Setup Guide for FixedFloat Wallet

## 📧 **Gmail SMTP Configuration**

### **Step 1: Enable 2-Factor Authentication**

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Factor Authentication if not already enabled

### **Step 2: Generate App Password**

1. Go to Google Account → Security
2. Under "2-Step Verification", click "App passwords"
3. Select "Mail" as the app
4. Select "Other" as the device and enter "FixedFloat Wallet"
5. Copy the generated 16-character app password

### **Step 3: Create .env File**

Create a `.env` file in your project root with the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fixedfloat-wallet

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# OTP Configuration
OTP_LENGTH=6
OTP_EXPIRES_IN=10m

# Email Service Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### **Step 4: Update Your Credentials**

Replace the following values in your `.env` file:

- `your-email@gmail.com` → Your actual Gmail address
- `your-16-character-app-password` → The app password you generated
- `your-super-secret-jwt-key-change-this-in-production` → A strong secret key

### **Step 5: Test Email Configuration**

```bash
# Test the email configuration
curl -X GET http://localhost:3000/api/auth/test-email
```

## 🔧 **SMTP Settings Used**

- **Host**: smtp.gmail.com
- **Port**: 587
- **Security**: STARTTLS (not SSL)
- **Authentication**: Required
- **Username**: Your Gmail address
- **Password**: App password (not your regular password)

## 📝 **Important Notes**

1. **Never use your regular Gmail password** - always use an app password
2. **App passwords are 16 characters** without spaces
3. **2-Factor Authentication must be enabled** to generate app passwords
4. **The .env file should never be committed to git** (it's in .gitignore)

## 🚨 **Troubleshooting**

### **Error: "Invalid login: 535-5.7.8 Username and Password not accepted"**

- Make sure you're using an app password, not your regular password
- Verify 2-Factor Authentication is enabled
- Check that the app password was generated correctly

### **Error: "Connection timeout"**

- Check your internet connection
- Verify Gmail SMTP settings are correct
- Try port 465 with secure: true if port 587 doesn't work

### **Error: "Authentication failed"**

- Double-check your email address and app password
- Make sure there are no extra spaces in the .env file
- Regenerate the app password if needed

## ✅ **Success Indicators**

When configured correctly, you should see:

- `✅ OTP email sent successfully to user@example.com`
- No authentication errors in the console
- Emails delivered to the recipient's inbox

## 🔒 **Security Best Practices**

1. Keep your `.env` file secure and never share it
2. Use strong, unique app passwords
3. Regularly rotate your app passwords
4. Monitor your Gmail account for unusual activity
5. Use environment-specific configurations for production

---

**Your FixedFloat Wallet is now ready to send OTP emails via Gmail SMTP!** 🚀
