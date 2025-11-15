# Testing Guide

## Overview

This project uses **Jest** as the testing framework with **Supertest** for HTTP endpoint testing.

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode (for development)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run tests in CI mode

```bash
npm run test:ci
```

## Test Structure

```
tests/
├── setup.ts                           # Global test setup
├── controllers/
│   └── userController.spec.ts        # User controller tests
└── middlewares/
    └── rateLimitMiddleware.spec.ts   # Rate limiting tests
```

## Rate Limiting Tests

The rate limiting middleware tests verify:

-   **Request limits**: Ensures rate limiters block requests after max limit
-   **Headers**: Verifies proper rate limit headers are sent
-   **Configuration**: Tests environment variable configuration
-   **Different limiters**: Tests auth, password reset, token refresh, and API limiters

### Example Test Run

```bash
npm test -- rateLimitMiddleware
```

## Writing Tests

### Basic Test Structure

```typescript
import request from "supertest";
import express from "express";

describe("Feature Name", () => {
    let app: express.Application;

    beforeEach(() => {
        // Setup before each test
        app = express();
    });

    afterEach(() => {
        // Cleanup after each test
    });

    it("should do something", async () => {
        const response = await request(app).get("/endpoint").send({});

        expect(response.status).toBe(200);
    });
});
```

### Testing Rate Limiters

Rate limiter tests use environment variables to configure faster test windows:

```typescript
process.env.RATE_LIMIT_AUTH_WINDOW_MS = "60000"; // 1 minute
process.env.RATE_LIMIT_AUTH_MAX_REQUESTS = "3";
```

## Coverage Reports

After running tests with coverage, view the report:

```bash
# Generate coverage
npm run test:coverage

# Open HTML coverage report (Windows)
start coverage/index.html

# Open HTML coverage report (Mac)
open coverage/index.html

# Open HTML coverage report (Linux)
xdg-open coverage/index.html
```

Coverage reports show:

-   Line coverage
-   Branch coverage
-   Function coverage
-   Statement coverage

**Note**: Coverage files are git-ignored and only available locally or as CI artifacts (30 days retention).

## CI/CD Integration

Tests run automatically on:

-   Push to main, develop branches
-   Pull requests

See `.github/workflows/backend-ci.yml` for CI configuration.

## Test Environment Variables

All test environment variables are configured in `backend/.env.test`:

-   `NODE_ENV=test`
-   `MYSQL_HOST=localhost`, `MYSQL_PORT=3306`
-   JWT secrets (test values - not sensitive)
-   Rate limiting (faster windows: 60000ms for testing)
-   Database credentials (test database)

### Using .env.test locally

To run tests locally with the same environment as CI:

```bash
# Copy test env file (one-time setup)
cp .env.test .env

# Run tests
npm test
```

### Adding New Environment Variables

When adding new environment variables:

1. Add to `backend/.env.example` with documentation
2. Add to `backend/.env.test` with test-appropriate values
3. Update CI workflow automatically uses `.env.test`

This ensures CI and local tests use identical configurations!

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `afterEach` to clean up resources
3. **Mocking**: Mock external dependencies (database, APIs)
4. **Descriptive names**: Use clear `describe` and `it` descriptions
5. **Fast tests**: Keep tests fast by using test-specific configurations

## Debugging Tests

### Run specific test file

```bash
npm test -- path/to/test.spec.ts
```

### Run tests matching pattern

```bash
npm test -- --testNamePattern="rate limit"
```

### Show console output

```bash
npm test -- --verbose
```

## Common Issues

### Rate Limiter Tests Timing Out

If rate limiter tests timeout, check:

-   Environment variables are set correctly
-   Window times are reasonable for tests (60000ms = 1 minute)
-   Test timeout is sufficient (`jest.setTimeout()`)

### Database Connection Errors

For integration tests requiring database:

-   Ensure MySQL is running
-   Check credentials in test environment
-   Verify database exists

## Adding New Tests

1. Create test file in appropriate directory
2. Follow naming convention: `*.spec.ts`
3. Import required dependencies
4. Write descriptive test cases
5. Run tests locally before committing
6. Ensure coverage doesn't drop

## Resources

-   [Jest Documentation](https://jestjs.io/)
-   [Supertest Documentation](https://github.com/visionmedia/supertest)
-   [Testing Best Practices](https://testingjavascript.com/)
