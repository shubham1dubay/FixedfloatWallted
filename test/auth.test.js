const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication API', () => {
    beforeEach(async () => {
        // Clean up database before each test
        await User.deleteMany({});
    });

    describe('POST /api/auth/signup', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User registered successfully. Please check your email for OTP verification.');
            expect(response.body.data.email).toBe(userData.email);
            expect(response.body.data.firstName).toBe(userData.firstName);
            expect(response.body.data.lastName).toBe(userData.lastName);
        });

        it('should fail with invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should fail with weak password', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'weak',
                firstName: 'John',
                lastName: 'Doe'
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
        });

        it('should fail with duplicate email', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            // Create first user
            await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(201);

            // Try to create second user with same email
            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User already exists with this email');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            const userData = {
                email: 'test@example.com',
                password: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            await request(app)
                .post('/api/auth/signup')
                .send(userData);
        });

        it('should login successfully with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'SecurePass123!'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Login successful');
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
        });

        it('should fail with invalid email', async () => {
            const loginData = {
                email: 'wrong@example.com',
                password: 'SecurePass123!'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should fail with invalid password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'WrongPassword123!'
            };

            const response = await request(app)
                .post('/api/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });
    });

    describe('POST /api/auth/verify-otp', () => {
        let user;
        let otp;

        beforeEach(async () => {
            // Create a test user
            const userData = {
                email: 'test@example.com',
                password: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe'
            };

            await request(app)
                .post('/api/auth/signup')
                .send(userData);

            // Get the user and generate OTP
            user = await User.findOne({ email: 'test@example.com' });
            otp = user.generateOTP();
            await user.save();
        });

        it('should verify OTP successfully', async () => {
            const otpData = {
                email: 'test@example.com',
                otp: otp
            };

            const response = await request(app)
                .post('/api/auth/verify-otp')
                .send(otpData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Email verified successfully');
            expect(response.body.data.isEmailVerified).toBe(true);
        });

        it('should fail with invalid OTP', async () => {
            const otpData = {
                email: 'test@example.com',
                otp: '000000'
            };

            const response = await request(app)
                .post('/api/auth/verify-otp')
                .send(otpData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid OTP');
        });

        it('should fail with expired OTP', async () => {
            // Manually expire the OTP
            user.otp.expires = new Date(Date.now() - 1000);
            await user.save();

            const otpData = {
                email: 'test@example.com',
                otp: otp
            };

            const response = await request(app)
                .post('/api/auth/verify-otp')
                .send(otpData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('OTP has expired');
        });
    });
});