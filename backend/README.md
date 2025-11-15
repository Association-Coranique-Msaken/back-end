# Association-Coranique-M'saken Backend

[![Backend CI](https://github.com/Association-Coranique-Msaken/back-end/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Association-Coranique-Msaken/back-end/actions/workflows/backend-ci.yml)
[![codecov](https://codecov.io/gh/Association-Coranique-Msaken/back-end/branch/main/graph/badge.svg)](https://codecov.io/gh/Association-Coranique-Msaken/back-end)

Backend project for Association Coranique M'saken management system.

## Prerequisites

Make sure you have the following installed:

-   Node.js (v18+)
-   npm (Node Package Manager)
-   Docker & Docker Compose
-   MySQL 8.0 (or use Docker Compose)

## Setup

```bash
git clone https://github.com/Association-Coranique-Msaken/back-end.git
cd back-end/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start with Docker Compose
docker-compose up
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Setup test environment (one-time)
npm run test:setup

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Type checking
npm run check

# Format code
npm run format

# Build for production
npm run build
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Request handlers
│   ├── DTOs/           # Data Transfer Objects & validation
│   ├── entities/       # TypeORM entities
│   ├── filters/        # Query filtering system
│   ├── helpers/        # Utility functions
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── workers/        # Background jobs
├── tests/              # Test files
└── dist/              # Compiled output
```

# Features

## Security

-   ✅ **JWT Authentication** - Access & refresh tokens
-   ✅ **Rate Limiting** - Prevents brute force attacks
-   ✅ **Helmet.js Security Headers** - XSS protection, clickjacking prevention, MIME type sniffing protection
-   ✅ **CORS Configuration** - Configurable allowed origins with credentials support
-   ✅ **Role-Based Access Control** - Admin roles (fullAccessAdmin, limitedAccess, readOnly)
-   ✅ **Password Hashing** - BCrypt encryption
-   ✅ **Token Blacklisting** - Logout invalidation

## API Features

-   **RESTful API** - Standard HTTP methods
-   **Pagination** - Efficient data retrieval
-   **Filtering** - Advanced query filtering
-   **Swagger Documentation** - Interactive API docs
-   **Error Handling** - Centralized error management

## Database

-   **MySQL 8.0** - Production-ready database
-   **TypeORM** - Type-safe ORM
-   **Migrations** - Database version control
-   **Soft Deletes** - Data preservation

## DevOps

-   **Docker** - Containerized deployment
-   **GitHub Actions CI** - Automated testing & building
-   **Environment Variables** - Configurable settings
-   **Test Coverage** - Jest test framework

# Documentation

-   [Testing Guide](./TESTING.md) - How to write and run tests
-   [CI/CD Guide](./CI.md) - GitHub Actions configuration
-   [API Documentation](http://localhost:5000/api-docs) - Swagger UI (when running)

## Security Configuration

### Helmet.js Security Headers

The application uses Helmet.js to set secure HTTP headers with **route-specific Content Security Policy**:

#### API Routes (`/api/*`) - Restrictive CSP

-   **X-Content-Type-Options**: Prevents MIME type sniffing
-   **X-Frame-Options**: Prevents clickjacking attacks
-   **X-XSS-Protection**: Enables browser XSS protection
-   **Strict-Transport-Security**: Enforces HTTPS connections
-   **Cross-Origin-Embedder-Policy**: `require-corp` for cross-origin isolation
-   **Content-Security-Policy**: Strict resource loading (`'self'` only)
-   **X-DNS-Prefetch-Control**: Controls DNS prefetching
-   **X-Download-Options**: Prevents file downloads from opening directly

#### Swagger Routes (`/api-docs/*`, `/swagger/*`) - Permissive CSP (Development Only)

-   Same security headers as API routes
-   **Content-Security-Policy**: Allows `'unsafe-inline'` for styles and scripts (required for Swagger UI)
-   **connect-src**: Allows API calls to `'self'`
-   **Environment**: Only available when `NODE_ENV ≠ prod`

**Security Note**: Swagger UI is disabled in production environments to prevent exposing API documentation and interactive testing capabilities to end users.

### CORS Configuration

Configure allowed origins in `.env`:

```env
# Single origin
FRONTEND_URL=http://localhost:3000

# Multiple origins (comma-separated)
FRONTEND_URL=http://localhost:3000,https://yourdomain.com,https://www.yourdomain.com
```

CORS settings:

-   ✅ Credentials support enabled
-   ✅ Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
-   ✅ Allowed headers: Content-Type, Authorization
-   ✅ Requests with no origin allowed (mobile apps, curl)

# Swagger-ts

-   To generate a <b>API TS</b> file from <b>swagger.json</b> :

```
npm run swagger:ts (TODO)
```

-   Then copy the generated file <b>src/api/myApi.ts</b> to your frontend folder (TODO)

<br>
<br>

# Migration

-   Create migration called init :

```
npx prisma migrate dev --name "init"
```

-   Upload seeds dummies data to DB :

```
I will add the CMD here
```

<br>
<br>

# Run Development environment:

```
docker-compose up --build
```

<br>
<br>

# Run Production environment:

```
I will add the CMD here
```

<br>
<br>
