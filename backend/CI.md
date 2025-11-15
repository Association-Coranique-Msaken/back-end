# GitHub Actions CI/CD Setup

## Overview

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### Backend CI (`backend-ci.yml`)

Runs on every push and pull request to main/develop branches.

#### Jobs

1. **Lint and Type Check**

    - Code formatting check with Prettier
    - TypeScript compilation check
    - Runs on Node.js 20.x

2. **Test**

    - Unit and integration tests
    - Runs on Node.js 18.x and 20.x (matrix)
    - Generates coverage reports
    - Uploads coverage to:
        - **GitHub Artifacts** (30 days retention)
        - **Codecov** (permanent, requires token)
    - Uses test environment variables

3. **Integration Test**

    - Tests with real MySQL database
    - MySQL 8.0 service container
    - Full database integration tests

4. **Build**

    - TypeScript compilation to dist/
    - Uploads build artifacts
    - Runs after tests pass

5. **Docker Build**

    - Builds Docker image
    - Tests Dockerfile validity
    - Uses BuildKit cache

6. **Security Scan**
    - npm audit for vulnerabilities
    - Snyk security scanning
    - Continues on non-critical issues

## Status Badges

Add these to your main README.md:

```markdown
[![Backend CI](https://github.com/Association-Coranique-Msaken/back-end/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Association-Coranique-Msaken/back-end/actions/workflows/backend-ci.yml)
[![codecov](https://codecov.io/gh/Association-Coranique-Msaken/back-end/branch/main/graph/badge.svg)](https://codecov.io/gh/Association-Coranique-Msaken/back-end)
```

## Environment Variables

### Required Secrets

Configure these in GitHub Settings → Secrets:

-   `SNYK_TOKEN` - For security scanning (optional)
-   `CODECOV_TOKEN` - For coverage reports (optional)

### CI Environment Variables

All environment variables are set in the workflow file for testing:

```yaml
env:
    NODE_ENV: test
    MYSQL_HOST: localhost
    MYSQL_PORT: 3306
    MYSQL_USER: root
    MYSQL_PASSWORD: root
    MYSQL_DB: test_db
    JWT_TOKEN_SECRET: test_secret_key_for_ci
    # ... (see workflow file for full list)
```

## Local Testing

To run tests locally with the same configuration as CI:

```bash
# Install dependencies
npm ci

# Run type checking
npm run check

# Run tests
npm run test:ci

# Run formatting check
npm run format -- --check
```

## Workflow Triggers

### Push

-   Branches: `main`, `develop`

### Pull Request

-   Target branches: `main`, `develop`

## MySQL Service

The integration test job uses MySQL as a service container:

```yaml
services:
    mysql:
        image: mysql:8.0
        env:
            MYSQL_ROOT_PASSWORD: root
            MYSQL_DATABASE: test_db
        ports:
            - 3306:3306
        options: >-
            --health-cmd="mysqladmin ping"
            --health-interval=10s
            --health-timeout=5s
            --health-retries=3
```

## Caching

-   **npm cache**: Cached between runs for faster installs
-   **Docker cache**: Uses GitHub Actions cache for Docker layers

## Artifacts & Coverage

### Viewing Coverage Reports

After a CI run completes:

1. **GitHub Artifacts (30 days)**

    - Go to Actions → Select workflow run
    - Scroll to "Artifacts" section at bottom
    - Download `coverage-report.zip`
    - Extract and open `index.html` in browser
    - **Retention**: 30 days, then auto-deleted

2. **Codecov (Permanent)**

    - Visit: https://codecov.io/gh/Association-Coranique-Msaken/back-end
    - View trends, diff coverage on PRs
    - Add badge to README (see Status Badges section)
    - **Requires**: `CODECOV_TOKEN` secret configured

3. **Local Coverage**
    ```bash
    npm run test:coverage
    open coverage/index.html
    ```

### What Gets Uploaded

-   `coverage/` directory (HTML reports, lcov.info)
-   `dist/` directory (compiled TypeScript)
-   Excluded via `.gitignore`:
    -   ✅ coverage/
    -   ✅ dist/
    -   ✅ node_modules/

## Debugging Failed Runs

1. Check the Actions tab in GitHub
2. Click on the failed workflow run
3. Expand the failed job/step
4. Review error messages and logs
5. Run the same commands locally to reproduce

## Adding New Workflows

1. Create `.github/workflows/your-workflow.yml`
2. Define triggers, jobs, and steps
3. Test locally if possible
4. Push and monitor in Actions tab

## Best Practices

-   ✅ Keep workflows fast (use caching)
-   ✅ Run expensive jobs only when needed
-   ✅ Use matrix builds for multi-version testing
-   ✅ Add meaningful job names and descriptions
-   ✅ Use `continue-on-error` for optional checks
-   ✅ Set appropriate timeouts
-   ✅ Use secrets for sensitive data

## Performance Tips

-   Use `npm ci` instead of `npm install`
-   Cache node_modules between runs
-   Run jobs in parallel when possible
-   Use Docker layer caching
-   Limit matrix builds to essential versions

## Monitoring

Monitor CI health:

-   Failed runs should be investigated immediately
-   Regular dependency updates
-   Security vulnerability scanning
-   Coverage trends over time

## Troubleshooting

### Tests Timing Out

-   Increase `testTimeout` in jest.config.js
-   Check for infinite loops or hanging promises
-   Review database connections cleanup

### Docker Build Failures

-   Verify Dockerfile syntax
-   Check base image availability
-   Review build context and .dockerignore

### Coverage Upload Issues

-   Verify Codecov token in secrets
-   Check coverage report generation
-   Ensure lcov.info file exists

## Resources

-   [GitHub Actions Documentation](https://docs.github.com/en/actions)
-   [Node.js Action](https://github.com/actions/setup-node)
-   [Docker Build Action](https://github.com/docker/build-push-action)
-   [Codecov Action](https://github.com/codecov/codecov-action)
