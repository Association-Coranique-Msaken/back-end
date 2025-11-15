module.exports = {
    roots: ["<rootDir>"],
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    testRegex: "(/tests/.*\\.(test|spec))\\.ts?$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverage: false, // Set to false for faster test runs. Use --coverage flag to enable.
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts", "!src/swagger.ts"],
    coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/tests/"],
    clearMocks: true,
    testEnvironment: "node",
    testTimeout: 10000,
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
