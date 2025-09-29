module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/test/**',
        '!**/coverage/**',
        '!jest.config.js',
        '!server.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testTimeout: 10000
};