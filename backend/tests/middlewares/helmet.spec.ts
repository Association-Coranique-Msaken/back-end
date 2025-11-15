import request from "supertest";
import express, { Application } from "express";
import helmet from "helmet";

describe("Helmet Security Headers", () => {
    let app: Application;

    beforeEach(() => {
        app = express();

        // Apply the same restrictive CSP as used for API routes
        app.use(
            "/api",
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        styleSrc: ["'self'"],
                        scriptSrc: ["'self'"],
                        imgSrc: ["'self'", "data:"],
                    },
                },
                crossOriginEmbedderPolicy: true, // Security: Enable COEP
            })
        );

        // Apply permissive CSP for Swagger UI routes (like production)
        app.use(
            ["/api-docs"],
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        styleSrc: ["'self'", "'unsafe-inline'"], // Required for Swagger UI
                        scriptSrc: ["'self'", "'unsafe-inline'"], // Required for Swagger UI
                        imgSrc: ["'self'", "data:"],
                        connectSrc: ["'self'"], // Allow API calls
                    },
                },
                crossOriginEmbedderPolicy: true, // Security: Enable COEP
            })
        );

        // Test routes
        app.get("/api/test", (req, res) => {
            res.json({ success: true });
        });

        app.get("/api-docs/test", (req, res) => {
            res.json({ success: true });
        });
    });

    it("should set X-Content-Type-Options header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("should set X-Frame-Options header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    });

    it("should set X-XSS-Protection header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-xss-protection"]).toBeDefined();
    });

    it("should set Strict-Transport-Security header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["strict-transport-security"]).toBeDefined();
        expect(response.headers["strict-transport-security"]).toContain("max-age=");
    });

    it("should set restrictive Content-Security-Policy for API routes", async () => {
        const response = await request(app).get("/api/test");
        const csp = response.headers["content-security-policy"];

        expect(csp).toBeDefined();
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain("style-src 'self'");
        expect(csp).toContain("script-src 'self'");
        // Should NOT contain 'unsafe-inline' for API routes
        expect(csp).not.toContain("'unsafe-inline'");
    });

    it("should set permissive Content-Security-Policy for Swagger routes", async () => {
        const response = await request(app).get("/api-docs/test");
        const csp = response.headers["content-security-policy"];

        expect(csp).toBeDefined();
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain("style-src 'self' 'unsafe-inline'");
        expect(csp).toContain("script-src 'self' 'unsafe-inline'");
        expect(csp).toContain("connect-src 'self'");
    });

    it("should set X-DNS-Prefetch-Control header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-dns-prefetch-control"]).toBe("off");
    });

    it("should set X-Download-Options header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-download-options"]).toBe("noopen");
    });

    it("should not expose X-Powered-By header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["x-powered-by"]).toBeUndefined();
    });

    it("should allow CSP directives for images on API routes", async () => {
        const response = await request(app).get("/api/test");
        const csp = response.headers["content-security-policy"];

        expect(csp).toContain("img-src 'self' data:");
        // Verify img-src directive specifically doesn't allow external HTTPS
        const imgSrcMatch = csp.match(/img-src ([^;]+)/);
        expect(imgSrcMatch).toBeTruthy();
        expect(imgSrcMatch![1]).toBe("'self' data:");
    });

    it("should allow CSP directives for images on Swagger routes", async () => {
        const response = await request(app).get("/api-docs/test");
        const csp = response.headers["content-security-policy"];

        expect(csp).toContain("img-src 'self' data:");
    });

    it("should set Cross-Origin-Embedder-Policy header", async () => {
        const response = await request(app).get("/api/test");

        expect(response.headers["cross-origin-embedder-policy"]).toBe("require-corp");
    });

    it("should set Cross-Origin-Embedder-Policy header for Swagger routes", async () => {
        const response = await request(app).get("/api-docs/test");

        expect(response.headers["cross-origin-embedder-policy"]).toBe("require-corp");
    });
});
