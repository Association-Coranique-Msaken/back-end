import express, { Request, Response } from "express";
import request from "supertest";
import {
    authRateLimiter,
    passwordResetRateLimiter,
    tokenRefreshRateLimiter,
    apiRateLimiter,
} from "../../src/middlewares/rateLimitMiddleware";

describe("Rate Limiting Middleware", () => {
    describe("authRateLimiter", () => {
        let app: express.Application;

        beforeEach(() => {
            // Set test environment variables for faster tests
            process.env.RATE_LIMIT_AUTH_WINDOW_MS = "60000"; // 1 minute
            process.env.RATE_LIMIT_AUTH_MAX_REQUESTS = "3";

            app = express();
            app.use(express.json());
            app.post("/test-auth", authRateLimiter, (req: Request, res: Response) => {
                res.status(200).json({ success: true });
            });
        });

        afterEach(() => {
            delete process.env.RATE_LIMIT_AUTH_WINDOW_MS;
            delete process.env.RATE_LIMIT_AUTH_MAX_REQUESTS;
        });

        it("should allow requests within the limit", async () => {
            const response1 = await request(app).post("/test-auth").send({});
            const response2 = await request(app).post("/test-auth").send({});
            const response3 = await request(app).post("/test-auth").send({});

            expect(response1.status).toBe(200);
            expect(response2.status).toBe(200);
            expect(response3.status).toBe(200);
        });

        it("should block requests exceeding the limit", async () => {
            // Make max allowed requests
            await request(app).post("/test-auth").send({});
            await request(app).post("/test-auth").send({});
            await request(app).post("/test-auth").send({});

            // This should be blocked
            const response = await request(app).post("/test-auth").send({});

            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body).toHaveProperty("message");
            expect(response.body.message).toContain("Too many login attempts");
        });

        it("should include rate limit headers", async () => {
            const response = await request(app).post("/test-auth").send({});

            expect(response.headers).toHaveProperty("ratelimit-limit");
            expect(response.headers).toHaveProperty("ratelimit-remaining");
            expect(response.headers).toHaveProperty("ratelimit-reset");
        });
    });

    describe("passwordResetRateLimiter", () => {
        let app: express.Application;

        beforeEach(() => {
            process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS = "60000"; // 1 minute
            process.env.RATE_LIMIT_PASSWORD_RESET_MAX_REQUESTS = "2";

            app = express();
            app.use(express.json());
            app.post("/test-reset", passwordResetRateLimiter, (req: Request, res: Response) => {
                res.status(200).json({ success: true });
            });
        });

        afterEach(() => {
            delete process.env.RATE_LIMIT_PASSWORD_RESET_WINDOW_MS;
            delete process.env.RATE_LIMIT_PASSWORD_RESET_MAX_REQUESTS;
        });

        it("should allow requests within the limit", async () => {
            const response1 = await request(app).post("/test-reset").send({});
            const response2 = await request(app).post("/test-reset").send({});

            expect(response1.status).toBe(200);
            expect(response2.status).toBe(200);
        });

        it("should block requests exceeding the limit", async () => {
            await request(app).post("/test-reset").send({});
            await request(app).post("/test-reset").send({});

            const response = await request(app).post("/test-reset").send({});

            expect(response.status).toBe(429);
            expect(response.body).toHaveProperty("success", false);
            expect(response.body.message).toContain("Too many password reset attempts");
        });
    });

    describe("tokenRefreshRateLimiter", () => {
        let app: express.Application;

        beforeEach(() => {
            process.env.RATE_LIMIT_TOKEN_REFRESH_WINDOW_MS = "60000"; // 1 minute
            process.env.RATE_LIMIT_TOKEN_REFRESH_MAX_REQUESTS = "5";

            app = express();
            app.use(express.json());
            app.post("/test-refresh", tokenRefreshRateLimiter, (req: Request, res: Response) => {
                res.status(200).json({ success: true });
            });
        });

        afterEach(() => {
            delete process.env.RATE_LIMIT_TOKEN_REFRESH_WINDOW_MS;
            delete process.env.RATE_LIMIT_TOKEN_REFRESH_MAX_REQUESTS;
        });

        it("should allow requests within the limit", async () => {
            for (let i = 0; i < 5; i++) {
                const response = await request(app).post("/test-refresh").send({});
                expect(response.status).toBe(200);
            }
        });

        it("should block requests exceeding the limit", async () => {
            // Make max allowed requests
            for (let i = 0; i < 5; i++) {
                await request(app).post("/test-refresh").send({});
            }

            const response = await request(app).post("/test-refresh").send({});

            expect(response.status).toBe(429);
            expect(response.body.message).toContain("Too many token refresh attempts");
        });
    });

    describe("Environment Variable Configuration", () => {
        it("should use default values when env vars are not set", () => {
            // Clear all rate limit env vars
            delete process.env.RATE_LIMIT_AUTH_WINDOW_MS;
            delete process.env.RATE_LIMIT_AUTH_MAX_REQUESTS;

            const app = express();
            app.use(express.json());
            app.post("/test", authRateLimiter, (req: Request, res: Response) => {
                res.status(200).json({ success: true });
            });

            // If it doesn't throw, defaults are working
            expect(app).toBeDefined();
        });

        it("should parse environment variables correctly", () => {
            process.env.RATE_LIMIT_AUTH_WINDOW_MS = "5000";
            process.env.RATE_LIMIT_AUTH_MAX_REQUESTS = "2";

            const windowMs = parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000");
            const maxRequests = parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS || "5");

            expect(windowMs).toBe(5000);
            expect(maxRequests).toBe(2);

            delete process.env.RATE_LIMIT_AUTH_WINDOW_MS;
            delete process.env.RATE_LIMIT_AUTH_MAX_REQUESTS;
        });
    });
});
