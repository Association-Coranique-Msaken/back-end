import request from "supertest";
import express, { Application } from "express";
import cors from "cors";

describe("CORS Configuration", () => {
    let app: Application;

    beforeEach(() => {
        app = express();

        // Simulate the same CORS configuration as production
        const allowedOrigins = ["http://localhost:3000", "https://example.com"];

        app.use(
            cors({
                origin: (origin, callback) => {
                    if (!origin) return callback(null, true);

                    if (allowedOrigins.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(new Error("Not allowed by CORS"));
                    }
                },
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization"],
            })
        );

        app.get("/test", (req, res) => {
            res.json({ success: true });
        });
    });

    it("should allow requests from allowed origin", async () => {
        const response = await request(app).get("/test").set("Origin", "http://localhost:3000");

        expect(response.status).toBe(200);
        expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    });

    it("should allow requests with credentials", async () => {
        const response = await request(app).get("/test").set("Origin", "http://localhost:3000");

        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });

    it("should handle preflight OPTIONS requests", async () => {
        const response = await request(app)
            .options("/test")
            .set("Origin", "http://localhost:3000")
            .set("Access-Control-Request-Method", "POST");

        expect(response.status).toBe(204);
        expect(response.headers["access-control-allow-methods"]).toBeDefined();
    });

    it("should allow specified HTTP methods", async () => {
        const response = await request(app)
            .options("/test")
            .set("Origin", "http://localhost:3000")
            .set("Access-Control-Request-Method", "POST");

        const allowedMethods = response.headers["access-control-allow-methods"];
        expect(allowedMethods).toContain("GET");
        expect(allowedMethods).toContain("POST");
        expect(allowedMethods).toContain("PUT");
        expect(allowedMethods).toContain("DELETE");
    });

    it("should allow specified headers", async () => {
        const response = await request(app)
            .options("/test")
            .set("Origin", "http://localhost:3000")
            .set("Access-Control-Request-Headers", "Content-Type,Authorization");

        expect(response.headers["access-control-allow-headers"]).toBeDefined();
    });

    it("should allow requests with no origin (mobile apps, curl)", async () => {
        const response = await request(app).get("/test");

        expect(response.status).toBe(200);
    });

    it("should allow multiple configured origins", async () => {
        const response1 = await request(app).get("/test").set("Origin", "http://localhost:3000");

        const response2 = await request(app).get("/test").set("Origin", "https://example.com");

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
        expect(response2.headers["access-control-allow-origin"]).toBe("https://example.com");
    });
});
