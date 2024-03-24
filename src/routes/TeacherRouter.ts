import express from "express";
import {
    createTeacher,
    deleteTeacher,
    getTeacherById,
    getTeachers,
    updateTeacher,
} from "../controllers/teacherController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import {
    adminAuthorization,
    readOnlyAdminAuthorization,
    fullAccessAdminAuthorization,
} from "../middlewares/checkAdminRole";

const teacherRouter = express.Router();

teacherRouter.put("/", adminAuthentication, fullAccessAdminAuthorization, createTeacher);
teacherRouter.get("/", adminAuthentication, readOnlyAdminAuthorization, getTeachers);
teacherRouter.get("/:id", adminAuthentication, readOnlyAdminAuthorization, getTeacherById);
teacherRouter.patch("/:id", adminAuthentication, fullAccessAdminAuthorization, updateTeacher);
teacherRouter.delete("/:id", adminAuthentication, fullAccessAdminAuthorization, deleteTeacher);

export default teacherRouter;
