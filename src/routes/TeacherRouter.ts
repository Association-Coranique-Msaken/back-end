import express from "express";
import {
    createTeacher,
    deleteTeacher,
    getTeacherById,
    getTeachers,
    updateTeacher,
} from "../controllers/teacherController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const teacherRouter = express.Router();

teacherRouter.put("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), createTeacher);

teacherRouter.get("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), getTeachers);

teacherRouter.get("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), getTeacherById);

teacherRouter.patch("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), updateTeacher);

teacherRouter.delete("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), deleteTeacher);

export default teacherRouter;
