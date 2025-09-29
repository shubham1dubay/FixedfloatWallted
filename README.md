# FixedFloat Wallet API

A comprehensive Node.js API for FixedFloat Wallet with authentication, OTP verification, and validation features.

## Features

- 🔐 **Authentication & Authorization**

  - User registration and login
  - JWT-based authentication
  - Role-based access control
  - Account lockout protection

- 📧 **Email Verification**

  - OTP-based email verification
  - Welcome emails
  - Password reset functionality

- 🛡️ **Security Features**

  - Password hashing with bcrypt
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers

- ✅ **Validation**
  - Comprehensive input validation
  - Email format validation
  - Password strength requirements
  - Phone number validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Validation**: Express-validator & Joi
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd FixedfloatWallted
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fixedfloat-wallet
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   OTP_EXPIRES_IN=10m
   OTP_LENGTH=6
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@fixedfloat.com
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint      | Description          | Access  |
| ------ | ------------- | -------------------- | ------- |
| POST   | `/signup`     | Register new user    | Public  |
| POST   | `/login`      | User login           | Public  |
| POST   | `/verify-otp` | Verify OTP for email | Public  |
| POST   | `/resend-otp` | Resend OTP           | Public  |
| POST   | `/logout`     | Logout user          | Private |

## API Usage Examples

### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Verify OTP

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data (if any)
  },
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Account Lockout**: 5 failed login attempts lock account for 30 minutes
- **JWT Security**: Secure token generation and validation
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers for protection

## Environment Variables

| Variable                 | Description               | Default                                     |
| ------------------------ | ------------------------- | ------------------------------------------- |
| `PORT`                   | Server port               | 3000                                        |
| `NODE_ENV`               | Environment               | development                                 |
| `MONGODB_URI`            | MongoDB connection string | mongodb://localhost:27017/fixedfloat-wallet |
| `JWT_SECRET`             | JWT secret key            | Required                                    |
| `JWT_EXPIRES_IN`         | JWT expiration time       | 24h                                         |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration  | 7d                                          |
| `OTP_EXPIRES_IN`         | OTP expiration time       | 10m                                         |
| `OTP_LENGTH`             | OTP length                | 6                                           |
| `EMAIL_HOST`             | SMTP host                 | smtp.gmail.com                              |
| `EMAIL_PORT`             | SMTP port                 | 587                                         |
| `EMAIL_USER`             | SMTP username             | Required                                    |
| `EMAIL_PASS`             | SMTP password             | Required                                    |
| `EMAIL_FROM`             | From email address        | noreply@fixedfloat.com                      |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure email settings
5. Set up reverse proxy (nginx)
6. Enable HTTPS
7. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@fixedfloat.com or create an issue in the repository.
