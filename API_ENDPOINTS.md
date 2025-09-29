# 🔗 FixedFloat Wallet - Complete API Endpoints

## 📊 **Base URL**

```
http://localhost:3000
```

---

## 🔐 **Authentication APIs**

### **1. User Registration**

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John" // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "firstName": "John",
    "requiresVerification": true
  }
}
```

### **2. User Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful. OTP sent to your email for additional security.",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "firstName": "John",
      "isEmailVerified": false,
      "role": "user",
      "lastLogin": "2025-01-29T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h",
    "otpInfo": {
      "sent": true,
      "expiresIn": "10 minutes",
      "message": "Check your email for OTP"
    }
  }
}
```

### **3. Send OTP**

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent to your email successfully",
  "data": {
    "email": "user@example.com",
    "otpExpiresIn": "10 minutes",
    "emailSent": true
  }
}
```

### **4. Verify OTP**

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "isEmailVerified": true
  }
}
```

### **5. Resend OTP**

```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP resent to your email successfully",
  "data": {
    "email": "user@example.com",
    "otpExpiresIn": "10 minutes",
    "emailSent": true
  }
}
```

### **6. Forgot Password**

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "data": {
    "email": "user@example.com",
    "emailSent": false,
    "expiresIn": "15 minutes"
  }
}
```

### **7. Reset Password**

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "password": "NewSecurePass123!"
}
```

**Response:**

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

### **8. Logout**

```http
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

### **9. Test Email**

```http
GET /api/auth/test-email
```

**Response:**

```json
{
  "success": false,
  "message": "Test email config not available. Only OTP email is configured.",
  "data": {
    "config": null,
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

---

## 💱 **Price Conversion APIs**

### **1. Get All Token Prices**

```http
GET /api/price
```

**Response:**

```json
{
  "success": true,
  "data": {
    "prices": {
      "BTC": 113458,
      "ETH": 4779,
      "TRX": 0.3615,
      "SOL": 205.85,
      "MATIC": 0.56,
      "BNB": 876,
      "USDT_ETH": 1.0,
      "USDT_TRON": 1.0,
      "LTC": 118.2,
      "ADA": 0.9096
    },
    "currency": "USD",
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

### **2. Get Specific Token Price**

```http
GET /api/price/BTC
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "BTC",
    "price": 113458,
    "currency": "USD",
    "timestamp": "2025-01-29T12:00:00.000Z"
  }
}
```

### **3. Convert Between Tokens**

```http
POST /api/price/convert
Content-Type: application/json

{
  "fromToken": "BTC",
  "toToken": "ETH",
  "amount": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fromToken": "BTC",
    "toToken": "ETH",
    "amount": 1,
    "convertedAmount": 23.7,
    "fromPrice": 113458,
    "toPrice": 4779,
    "usdValue": 113458
  }
}
```

### **4. Get Price History**

```http
GET /api/price/BTC/history?days=7
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "BTC",
    "history": [
      {
        "date": "2025-01-22",
        "price": 108234.5,
        "timestamp": 1737561600000
      },
      {
        "date": "2025-01-23",
        "price": 110456.75,
        "timestamp": 1737648000000
      }
    ],
    "days": 7
  }
}
```

---

## 🏥 **Health Check**

### **Health Check**

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "message": "FixedFloat Wallet API is running",
  "timestamp": "2025-01-29T12:00:00.000Z",
  "environment": "development"
}
```

---

## 🧪 **Testing Examples**

### **Test Authentication:**

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!", "firstName": "Test"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123!"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

### **Test Price Conversion:**

```bash
# Get all prices
curl -X GET http://localhost:3000/api/price

# Get BTC price
curl -X GET http://localhost:3000/api/price/BTC

# Convert 1 BTC to ETH
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "BTC", "toToken": "ETH", "amount": 1}'

# Convert 10 ETH to SOL
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "ETH", "toToken": "SOL", "amount": 10}'
```

---

## 📊 **Supported Tokens**

| Token         | Symbol    | Current Price (USD) |
| ------------- | --------- | ------------------- |
| Bitcoin       | BTC       | $113,458            |
| Ethereum      | ETH       | $4,779              |
| TRON          | TRX       | $0.3615             |
| Solana        | SOL       | $205.85             |
| Polygon       | MATIC     | $0.56               |
| BNB           | BNB       | $876                |
| Tether (ETH)  | USDT_ETH  | $1.00               |
| Tether (TRON) | USDT_TRON | $1.00               |
| Litecoin      | LTC       | $118.20             |
| Cardano       | ADA       | $0.9096             |

---

## 🔒 **Authentication Required**

Some endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Protected Endpoints:**

- `POST /api/auth/logout`

**Public Endpoints:**

- All `/api/price/*` endpoints
- All other `/api/auth/*` endpoints

---

## 📝 **Error Responses**

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

**🚀 Your FixedFloat Wallet API is ready to use!**
