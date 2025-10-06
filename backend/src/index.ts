import "reflect-metadata";
import express, { type Request, type Response, type Application } from "express";
import dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import { appDataSource } from "./config/database";
import AdminRouter from "./routes/adminRouter";
import authRouter from "./routes/authRouter";
import UserRouter from "./routes/userRouter";
import TeacherRouter from "./routes/teacherRouter";
import InvalidTokensRouter from "./routes/tokensRouter";
import { ScheduleInvalidTokensWorker } from "./workers/invalidTokensWorker";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./swagger";

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
app.use("/api/v1/admin-api", AdminRouter);
app.use("/api/v1/user-api", UserRouter);
app.use("/api/v1/teacher-api", TeacherRouter);
app.use("/api/v1/token-api", InvalidTokensRouter);

app.use(errorHandler);

// Default route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Express & TypeScript Server :) nice");
});

// setup swagger api docs
setupSwagger(app);

// Start the server
app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});

ScheduleInvalidTokensWorker();
