import express from "express";
import {
    createTeacher,
    deleteTeacher,
    getTeacherById,
    getTeachers,
    updateTeacher,
} from "../controllers/teacherController";
import { adminAuthentification } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const teacherRouter = express.Router();

teacherRouter.post("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), createTeacher);

teacherRouter.get("/", getTeachers);

teacherRouter.get("/:id", getTeacherById);

teacherRouter.patch("/:id", updateTeacher);

teacherRouter.delete("/:id", deleteTeacher);

export default teacherRouter;
