import express from "express";
import {
    createAdmin,
    createTeacher,
    createUser,
    deleteTeacher,
    deleteUser,
    getAdmins,
    getTeacherById,
    getTeachers,
    getUserById,
    getUsers,
    updateTeacher,
    updateUser,
} from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { readOnlyAdminAuthorization, fullAccessAdminAuthorization } from "../middlewares/checkAdminRole";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";

const adminRouter = express.Router();

adminRouter.get("/admin/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getAdmins);

adminRouter.post("/admin/", adminAuthentication, fullAccessAdminAuthorization, createAdmin);

adminRouter.post("/teacher/", adminAuthentication, fullAccessAdminAuthorization, createTeacher);

adminRouter.get("/teacher/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getTeachers);

adminRouter.get("/teacher/:id", adminAuthentication, readOnlyAdminAuthorization, getTeacherById);

adminRouter.patch("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, updateTeacher);

adminRouter.delete("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, deleteTeacher);

adminRouter.post("/user/", adminAuthentication, fullAccessAdminAuthorization, createUser);

adminRouter.get("/user/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getUsers);

adminRouter.get("/user/:id", adminAuthentication, readOnlyAdminAuthorization, getUserById);

adminRouter.patch("/user/:id", adminAuthentication, fullAccessAdminAuthorization, updateUser);

adminRouter.delete("/user/:id", adminAuthentication, fullAccessAdminAuthorization, deleteUser);

export default adminRouter;
