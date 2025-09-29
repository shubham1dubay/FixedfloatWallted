# FixedFloat Wallet API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message",
      "value": "invalidValue"
    }
  ]
}
```

## API Endpoints

### 1. User Registration

**POST** `/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "64a1b2c3d4e5f6789abcdef0",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "requiresVerification": true
  }
}
```

**Validation Rules:**

- Email: Valid email format, unique
- Password: Min 8 chars, must contain uppercase, lowercase, number, special character
- First Name: 2-50 characters, letters and spaces only (optional)
- Last Name: 2-50 characters, letters and spaces only (optional)

### 2. User Login

**POST** `/auth/login`

Authenticate user and return JWT tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789abcdef0",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "role": "user",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 3. Verify OTP

**POST** `/auth/verify-otp`

Verify email with OTP code.

**Request Body:**

```json
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
    "userId": "64a1b2c3d4e5f6789abcdef0",
    "email": "user@example.com",
    "isEmailVerified": true
  }
}
```

### 4. Resend OTP

**POST** `/auth/resend-otp`

Resend OTP for email verification.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 5. Logout

**POST** `/auth/logout`

Logout user (client-side token removal).

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created                              |
| 400         | Bad Request - Validation Error       |
| 401         | Unauthorized - Invalid/Missing Token |
| 403         | Forbidden - Insufficient Permissions |
| 404         | Not Found                            |
| 423         | Locked - Account Temporarily Locked  |
| 429         | Too Many Requests - Rate Limited     |
| 500         | Internal Server Error                |

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 status with error message

## Security Features

1. **Password Requirements**:

   - Minimum 8 characters
   - Must contain uppercase letter
   - Must contain lowercase letter
   - Must contain number
   - Must contain special character

2. **Account Lockout**:

   - 5 failed login attempts
   - 30-minute lockout period

3. **JWT Security**:

   - Access tokens expire in 24 hours
   - Refresh tokens expire in 7 days
   - Secure token generation

4. **OTP Security**:

   - 6-digit numeric OTP
   - 10-minute expiration
   - Maximum 3 attempts

5. **Input Validation**:
   - Comprehensive validation for all inputs
   - SQL injection protection
   - XSS protection

## Testing

Use the provided test users for development:

**Admin User:**

- Email: `admin@fixedfloat.com`
- Password: `AdminPass123!`

**Test User:**

- Email: `test@fixedfloat.com`
- Password: `TestPass123!`

## Support

For API support or questions, contact:

- Email: support@fixedfloat.com
- Documentation: [API Documentation](./API.md)
