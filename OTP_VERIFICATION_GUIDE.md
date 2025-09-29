# 🔐 OTP Verification Guide - FixedfloatWallet API

## ✅ **FIXED: OTP Verification Flow**

### **Updated API Endpoints:**

#### **1. Send OTP**

```bash
POST /api/auth/send-otp
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP generated successfully. Check console for OTP.",
  "data": {
    "email": "user@example.com",
    "otpExpiresIn": "10 minutes",
    "emailSent": false
  }
}
```

#### **2. Verify OTP** ✅ **UPDATED**

```bash
POST /api/auth/verify-otp
```

**Request:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "68da60848646ca2311119bf2",
    "email": "user@example.com",
    "isEmailVerified": true
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

## 🚀 **Complete Flow:**

### **Step 1: Signup**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John"
  }'
```

### **Step 2: Send OTP**

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### **Step 3: Check Console for OTP**

Look in your server console for:

```
🔐 OTP for user@example.com: 123456
⏰ OTP expires in 10 minutes
```

### **Step 4: Verify OTP**

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

## 📧 **Email Status:**

### **If Email Configured:**

- ✅ OTP sent to email
- ✅ OTP also shown in console
- ✅ Verify using either source

### **If Email NOT Configured:**

- ✅ OTP shown in console only
- ✅ Verify using console OTP

## 🎯 **Key Features:**

1. **✅ OTP Verification** - `/api/auth/verify-otp` now verifies OTP
2. **✅ Console Fallback** - OTP always shown in console
3. **✅ Email Support** - OTP sent to email when configured
4. **✅ Error Handling** - Proper validation and error messages
5. **✅ Expiration** - OTP expires in 10 minutes

## 🧪 **Testing:**

### **Test Wrong OTP:**

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "000000"}'
```

**Expected:** `{"success": false, "message": "Invalid or expired OTP"}`

### **Test Correct OTP:**

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

**Expected:** `{"success": true, "message": "Email verified successfully"}`

## 📝 **Notes:**

- OTP is 6 digits
- OTP expires in 10 minutes
- OTP is always shown in server console
- Email verification is required for full access
- After verification, user can login normally

---

**✅ The OTP verification is now working perfectly!**
