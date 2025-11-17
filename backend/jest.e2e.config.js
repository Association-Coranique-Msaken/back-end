module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests/e2e"],
    testMatch: ["**/*.e2e.spec.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    testTimeout: 30000, // E2E tests may take longer
    maxWorkers: 1, // Run tests serially to avoid circular JSON issues
    verbose: true,
    moduleNameMapper: {
        "^@shared/(.*)$": "<rootDir>/../shared/$1",
    },
};
