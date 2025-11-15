// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = "test";
// The following JWT secrets are for testing only. NEVER use these in production!
process.env.JWT_TOKEN_SECRET = "INSECURE_TEST_SECRET_DO_NOT_USE_IN_PRODUCTION";
process.env.JWT_EXP_IN = "1h";
process.env.JWT_REFRESH_TOKEN_SECRET = "INSECURE_TEST_REFRESH_SECRET_DO_NOT_USE_IN_PRODUCTION";
process.env.JWT_REFRESH_EXP_IN = "7d";
process.env.JWT_RESET_PSWD_SECRET = "INSECURE_TEST_RESET_SECRET_DO_NOT_USE_IN_PRODUCTION";
process.env.JWT_RESET_PSWD_EXP_IN = "1h";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.WEBSITE_URL = "http://localhost:3000/";
process.env.MYSQL_HOST = "localhost";
process.env.MYSQL_PORT = "3306";
process.env.MYSQL_USER = "root";
process.env.MYSQL_PASSWORD = "";
process.env.MYSQL_DB = "test_db";

// Rate limiting - faster for tests
process.env.RATE_LIMIT_AUTH_WINDOW_MS = "60000";
process.env.RATE_LIMIT_AUTH_MAX_REQUESTS = "5";
process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS = "60000";
process.env.RATE_LIMIT_PASSWORD_RESET_MAX_REQUESTS = "3";
process.env.RATE_LIMIT_TOKEN_REFRESH_WINDOW_MS = "60000";
process.env.RATE_LIMIT_TOKEN_REFRESH_MAX_REQUESTS = "10";
process.env.RATE_LIMIT_API_WINDOW_MS = "60000";
process.env.RATE_LIMIT_API_MAX_REQUESTS = "100";

// Increase default timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging
    error: console.error,
};
