#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fixedfloat-wallet');
        console.log('📦 Connected to MongoDB');

        // Create admin user if it doesn't exist
        const adminExists = await User.findOne({ email: 'admin@fixedfloat.com' });

        if (!adminExists) {
            const adminUser = new User({
                email: 'admin@fixedfloat.com',
                password: 'AdminPass123!',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isEmailVerified: true,
                isActive: true
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully');
            console.log('📧 Email: admin@fixedfloat.com');
            console.log('🔑 Password: AdminPass123!');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create test user if it doesn't exist
        const testUserExists = await User.findOne({ email: 'test@fixedfloat.com' });

        if (!testUserExists) {
            const testUser = new User({
                email: 'test@fixedfloat.com',
                password: 'TestPass123!',
                firstName: 'Test',
                lastName: 'User',
                role: 'user',
                isEmailVerified: true,
                isActive: true
            });

            await testUser.save();
            console.log('✅ Test user created successfully');
            console.log('📧 Email: test@fixedfloat.com');
            console.log('🔑 Password: TestPass123!');
        } else {
            console.log('ℹ️  Test user already exists');
        }

        console.log('🎉 Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
};

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;