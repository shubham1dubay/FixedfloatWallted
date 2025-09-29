# 🏗️ FixedFloat Wallet - Project Structure

## 📁 **Organized Folder Structure**

```
FixedfloatWallted/
├── 📁 src/                          # Source code directory
│   ├── 📁 controllers/              # Business logic controllers
│   │   ├── authController.js        # Authentication logic
│   │   └── priceController.js       # Price conversion logic
│   ├── 📁 models/                   # Database models
│   │   └── User.js                  # User schema
│   ├── 📁 routes/                   # API routes
│   │   ├── auth.js                  # Authentication routes
│   │   └── price.js                 # Price conversion routes
│   ├── 📁 middleware/               # Custom middleware
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling
│   │   └── validation.js            # Input validation
│   ├── 📁 utils/                    # Utility functions
│   │   ├── email.js                 # Email service
│   │   ├── jwt.js                   # JWT utilities
│   │   └── priceService.js          # Price conversion service
│   ├── 📁 config/                   # Configuration files
│   │   └── database.js              # Database connection
│   ├── app.js                       # Express app configuration
│   └── server.js                    # Server startup
├── 📁 docs/                         # Documentation
│   ├── API.md                       # Authentication API docs
│   ├── CONVERSION_API.md            # Price conversion API docs
│   └── README.md                    # This file
├── 📁 test/                         # Test files
│   └── auth.test.js                 # Authentication tests
├── 📁 scripts/                      # Utility scripts
│   └── setup.js                     # Database setup
├── 📄 server.js                     # Main entry point
├── 📄 package.json                  # Dependencies
├── 📄 README.md                     # Project overview
└── 📄 .gitignore                    # Git ignore rules
```

## 🎯 **Key Features**

### **1. Authentication System**

- ✅ User registration with email verification
- ✅ Login with OTP verification
- ✅ Password reset functionality
- ✅ JWT token-based authentication
- ✅ Account lockout protection

### **2. Price Conversion API**

- ✅ Real-time cryptocurrency prices
- ✅ Token-to-token conversion
- ✅ Price history tracking
- ✅ Support for 10+ major tokens

### **3. Email Service**

- ✅ OTP email sending
- ✅ Welcome email (placeholder)
- ✅ Password reset email (placeholder)
- ✅ Gmail integration

## 🚀 **Quick Start**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Environment Setup**

```bash
cp .env.example .env
# Edit .env with your configuration
```

### **3. Start Server**

```bash
# Development
npm run dev

# Production
npm start
```

### **4. Test APIs**

```bash
# Health check
curl http://localhost:3000/health

# Get all prices
curl http://localhost:3000/api/price

# Convert 1 BTC to ETH
curl -X POST http://localhost:3000/api/price/convert \
  -H "Content-Type: application/json" \
  -d '{"fromToken": "BTC", "toToken": "ETH", "amount": 1}'
```

## 📊 **API Endpoints**

### **Authentication APIs**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### **Price Conversion APIs**

- `GET /api/price` - Get all token prices
- `GET /api/price/BTC` - Get specific token price
- `POST /api/price/convert` - Convert between tokens
- `GET /api/price/BTC/history` - Get price history

## 🛠️ **Development**

### **Project Structure Benefits**

1. **Separation of Concerns** - Each folder has a specific purpose
2. **Scalability** - Easy to add new features
3. **Maintainability** - Clear organization makes code easy to maintain
4. **Reusability** - Controllers and services can be reused
5. **Testing** - Easy to write and run tests

### **Adding New Features**

1. **New Controller** - Add to `src/controllers/`
2. **New Route** - Add to `src/routes/`
3. **New Model** - Add to `src/models/`
4. **New Service** - Add to `src/utils/`
5. **New Middleware** - Add to `src/middleware/`

## 📝 **Documentation**

- [Authentication API](./API.md)
- [Price Conversion API](./CONVERSION_API.md)

## 🔧 **Configuration**

All configuration is handled through environment variables in `.env` file.

**🚀 Your FixedFloat Wallet is now properly organized and ready for development!**
