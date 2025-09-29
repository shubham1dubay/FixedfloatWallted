const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 FixedFloat Wallet API running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📈 Price API: http://localhost:${PORT}/api/price`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err.message);
    process.exit(1);
});

module.exports = server;