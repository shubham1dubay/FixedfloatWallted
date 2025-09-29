# 📧 Email Fix Guide - FixedFloat Wallet

## ❌ **Current Issue:**

```
Email configuration failed: Invalid login: 535-5.7.8 Username and Password not accepted
```

## 🔧 **SOLUTION: Fix Gmail Authentication**

### **Step 1: Enable 2-Factor Authentication**

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Enable it if not already enabled

### **Step 2: Generate App Password**

1. In Google Account Security, click **"2-Step Verification"**
2. Scroll down to **"App passwords"**
3. Click **"App passwords"**
4. Select **"Mail"** and **"Other (Custom name)"**
5. Enter name: `FixedFloatWallet API`
6. Click **"Generate"**
7. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### **Step 3: Update .env File**

Open your `.env` file and update:

```bash
EMAIL_USER=shubham.dubey@oodles.io
EMAIL_PASS=abcd efgh ijkl mnop  # Use App Password here
EMAIL_FROM=noreply@fixedfloat.com
```

### **Step 4: Test Email**

```bash
node setup-email-simple.js
```

## 🚀 **After Fix - Test API:**

### **1. Start Server:**

```bash
npm run dev
```

### **2. Test Signup (Sends OTP to Email):**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!", "firstName": "Test"}'
```

### **3. Test Login (Sends OTP to Email):**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!"}'
```

### **4. Test Send OTP:**

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## ✅ **Expected Results:**

### **Console Output:**

```
📧 OTP sent to test@example.com successfully: <message-id>
```

### **Email Received:**

- Beautiful HTML email with OTP
- Professional design
- 10-minute expiration
- Security information

## 🆘 **Alternative Email Providers:**

### **Outlook/Hotmail:**

```bash
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@fixedfloat.com
```

### **Yahoo:**

```bash
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@fixedfloat.com
```

## 📱 **API Endpoints That Send Email:**

1. **POST /api/auth/signup** - Sends verification OTP
2. **POST /api/auth/login** - Sends login OTP
3. **POST /api/auth/send-otp** - Sends OTP to email
4. **POST /api/auth/resend-otp** - Resends OTP
5. **GET /api/auth/test-email** - Tests email config

## 🎯 **Quick Commands:**

```bash
# Test email setup
node setup-email-simple.js

# Start server
npm run dev

# Test API
curl -X GET http://localhost:3000/api/auth/test-email
```

---

**🎉 After fixing Gmail App Password, all OTPs will be sent to email instead of console!**
