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

teacherRouter.get("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), getTeachers);

teacherRouter.get("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), getTeacherById);

teacherRouter.patch("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), updateTeacher);

teacherRouter.delete("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), deleteTeacher);

export default teacherRouter;
