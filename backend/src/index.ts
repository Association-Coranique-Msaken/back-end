import "reflect-metadata";
import express, { type Request, type Response, type Application } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { appDataSource } from "./config/database";
import AdminRouter from "./routes/adminRouter";
import authRouter from "./routes/authRouter";
import UserRouter from "./routes/userRouter";
import TeacherRouter from "./routes/teacherRouter";
import InvalidTokensRouter from "./routes/tokensRouter";
import { ScheduleInvalidTokensWorker } from "./workers/invalidTokensWorker";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./swagger";
import { apiRateLimiter } from "./middlewares/rateLimitMiddleware";

// establish database connection
appDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

// For env File
dotenv.config();

const app: Application = express();
const port = process.env.SERVER_PORT || 5000;

// Security middleware - Helmet.js for HTTP headers
// Apply restrictive CSP for API routes
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
        // COEP enabled for better cross-origin isolation
        crossOriginEmbedderPolicy: true,
    })
);

// Apply permissive CSP for Swagger UI routes (only in development)
if (process.env.NODE_ENV !== "prod") {
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
            // COEP enabled for better security (Swagger UI works with COEP)
            crossOriginEmbedderPolicy: true,
        })
    );
}

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : ["http://localhost:3000"];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
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

app.use(bodyParser.json());

// Apply general rate limiting to all API routes
app.use("/api/", apiRateLimiter);

// setup swagger api docs (only in development environment)
if (process.env.NODE_ENV !== "prod") {
    setupSwagger(app);
}

// Define API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin-api", AdminRouter);
app.use("/api/v1/user-api", UserRouter);
app.use("/api/v1/teacher-api", TeacherRouter);
app.use("/api/v1/token-api", InvalidTokensRouter);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server :) nice");
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});

ScheduleInvalidTokensWorker();
