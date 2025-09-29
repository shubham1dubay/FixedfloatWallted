# 📧 Email Setup Guide for FixedfloatWallet API

## 🚨 Current Issue
Gmail authentication is failing with error: `535-5.7.8 Username and Password not accepted`

## 🔧 Solution 1: Gmail App Password (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on **2-Step Verification**
3. Enable it if not already enabled

### Step 2: Generate App Password
1. In Google Account Security, click **2-Step Verification**
2. Scroll down to **App passwords**
3. Click **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter name: `FixedfloatWallet API`
6. Click **Generate**
7. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
```bash
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Use App Password, NOT regular password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=noreply@fixedfloat.com
```

## 🔧 Solution 2: Alternative Email Providers

### Option A: Outlook/Hotmail
```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_FROM=noreply@fixedfloat.com
```

### Option B: Yahoo Mail
```bash
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password  # Yahoo also requires App Password
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_FROM=noreply@fixedfloat.com
```

### Option C: SendGrid (Professional)
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API Key
3. Use these settings:
```bash
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_FROM=noreply@fixedfloat.com
```

## 🔧 Solution 3: Disable Email (Development Only)

If you want to skip email for now, the API will show OTP in console:

```bash
# Comment out or remove email variables
# EMAIL_USER=
# EMAIL_PASS=
# EMAIL_HOST=
# EMAIL_PORT=
# EMAIL_FROM=
```

## 🧪 Testing Email Configuration

After updating your `.env` file:

```bash
# Test email configuration
node test-email.js

# Test API endpoints
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!", "firstName": "Test"}'
```

## ✅ Expected Results

### If Email Works:
```
📧 OTP sent to user@example.com
```

### If Email Fails:
```
⚠️  Email not configured. OTP for user@example.com: 123456
⏰ OTP expires in 10 minutes
```

## 🆘 Troubleshooting

### Gmail Issues:
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check if "Less secure app access" is enabled (older accounts)

### General Issues:
- Check internet connection
- Verify email credentials
- Check firewall settings
- Try different email provider

## 📞 Support

If you're still having issues:
1. Try a different email provider
2. Check your email provider's SMTP settings
3. Contact your email provider's support
4. Use console OTP for development

---
**Note:** The API works perfectly even without email - OTP will be shown in console logs.