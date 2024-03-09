import express from "express";
import { createTeacher, getTeachers } from "../controllers/teacherController";

const teacherRouter = express.Router();

teacherRouter.post("/", createTeacher); //TODO: add authentication and authorization admin
teacherRouter.get("/", getTeachers);

export default teacherRouter;
