# 🔐 Forgot Password API - FixedFloat Wallet

## ✅ **New API Endpoints Created:**

### **1. Forgot Password**

```bash
POST /api/auth/forgot-password
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "data": {
    "email": "user@example.com",
    "emailSent": true,
    "expiresIn": "15 minutes"
  }
}
```

**Response (Email Not Configured):**

```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "data": {
    "email": "user@example.com",
    "resetToken": "abc123def456ghi789",
    "emailSent": false,
    "expiresIn": "15 minutes"
  }
}
```

### **2. Reset Password**

```bash
POST /api/auth/reset-password
```

**Request:**

```json
{
  "token": "abc123def456ghi789",
  "password": "NewSecurePass123!"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "email": "user@example.com",
    "message": "You can now login with your new password"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

## 🚀 **Complete Forgot Password Flow:**

### **Step 1: User Requests Password Reset**

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### **Step 2: User Receives Email**

- Beautiful HTML email with reset link
- Reset token included in email
- 15-minute expiration
- Professional design

### **Step 3: User Resets Password**

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "reset-token-from-email", "password": "NewPassword123!"}'
```

### **Step 4: User Can Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "NewPassword123!"}'
```

## 📧 **Email Features:**

### **Password Reset Email Includes:**

- 🎨 **Professional Design** - Beautiful HTML template
- 🔗 **Reset Link** - Clickable button to reset password
- 🔐 **Reset Token** - Manual token for API use
- ⏰ **Expiration Warning** - 15-minute expiry notice
- 🛡️ **Security Info** - Instructions and warnings

### **Email Template Features:**

- Gradient header with FixedFloat Wallet branding
- Clear instructions for password reset
- Both clickable link and manual token
- Professional footer with contact info
- Responsive design for all devices

## 🔧 **Technical Details:**

### **Security Features:**

- ✅ **Token Expiration** - 15-minute expiry
- ✅ **One-Time Use** - Token cleared after use
- ✅ **Secure Generation** - Random token generation
- ✅ **Email Validation** - Validates email format
- ✅ **Password Validation** - Strong password requirements

### **Database Fields:**

- `passwordResetToken` - Reset token string
- `passwordResetExpires` - Token expiration date

### **Validation Rules:**

- Email must be valid format
- Password must be 8+ characters
- Password must contain uppercase, lowercase, number, special character

## 🧪 **Testing:**

### **Test Forgot Password:**

```bash
# Test with valid email
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test with invalid email
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'
```

### **Test Reset Password:**

```bash
# Test with valid token
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "valid-token", "password": "NewPass123!"}'

# Test with invalid token
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "invalid-token", "password": "NewPass123!"}'
```

## 📱 **API Endpoints Summary:**

| Method | Endpoint                    | Description               | Access  |
| ------ | --------------------------- | ------------------------- | ------- |
| POST   | `/api/auth/forgot-password` | Send reset token to email | Public  |
| POST   | `/api/auth/reset-password`  | Reset password with token | Public  |
| POST   | `/api/auth/signup`          | Register user             | Public  |
| POST   | `/api/auth/login`           | Login user                | Public  |
| POST   | `/api/auth/verify-otp`      | Verify OTP                | Public  |
| POST   | `/api/auth/send-otp`        | Send OTP to email         | Public  |
| POST   | `/api/auth/resend-otp`      | Resend OTP                | Public  |
| POST   | `/api/auth/logout`          | Logout user               | Private |
| GET    | `/api/auth/test-email`      | Test email config         | Public  |

## 🎯 **Key Benefits:**

1. **✅ Complete Password Reset Flow** - End-to-end functionality
2. **✅ Beautiful Email Templates** - Professional design
3. **✅ Security Features** - Token expiration, validation
4. **✅ Easy Integration** - Simple API endpoints
5. **✅ Error Handling** - Comprehensive error messages
6. **✅ Email Fallback** - Console token if email fails

---

**🎉 Your forgot password API is now complete and ready to use!**
