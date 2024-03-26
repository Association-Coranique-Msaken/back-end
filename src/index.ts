import express, { type Request, type Response, type Application } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import { appDataSource } from "./config/Database";
import AdminRouter from "./routes/AdminRouter";
import authRouter from "./routes/AuthRouter";
import UserRouter from "./routes/UserRouter";
import TeacherRouter from "./routes/TeacherRouter";
import fs from "fs";
import InvalidTokensRouter from "./routes/InvalidTokensRouter";
import { ScheduleInvalidTokensWorker } from "./workers/InvalidTokensWorker";
import { errorHandler } from "./middlewares/error.middleware";
const swaggerUi = require("swagger-ui-express");

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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/adminapi", AdminRouter);
app.use("/api/v1/userapi", UserRouter);
app.use("/api/v1/teacherapi", TeacherRouter);
app.use("/api/v1/tokenapi", InvalidTokensRouter);

app.use(errorHandler);

// s chaima
// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server :) nice");
});

// Dynamically generate and write Swagger JSON file
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Your API Documentation",
        description: "API Documentation for your Express server",
    },
    paths: {
        "/api/v1/admin": {
            get: {
                summary: "get admin",
                description: "Create an admin",
            },
        },
    },
};
fs.writeFileSync("./swagger.json", JSON.stringify(swaggerDocument, null, 2));

// Serve Swagger UI with the dynamically generated Swagger JSON
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// Start the server
app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});

ScheduleInvalidTokensWorker();
