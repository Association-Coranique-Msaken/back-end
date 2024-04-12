import express from "express";
import {
    createAdmin,
    createGroup,
    createTeacher,
    createUser,
    deleteAdminById,
    deleteGroupById,
    deleteTeacherById,
    deleteUserById,
    getAdminById,
    getAdmins,
    getGroupById,
    getGroups,
    getTeacherById,
    getTeacherGroups,
    getTeachers,
    getUserById,
    getUsers,
    updateAdmin,
    updateGroup,
    updateTeacher,
    updateUser,
} from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { readOnlyAdminAuthorization, fullAccessAdminAuthorization } from "../middlewares/checkAdminRole";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";

const adminRouter = express.Router();

adminRouter.post("/admin/", adminAuthentication, fullAccessAdminAuthorization, createAdmin);
adminRouter.get("/admin/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getAdmins);
adminRouter.get("/admin/:id", adminAuthentication, readOnlyAdminAuthorization, getAdminById);
adminRouter.patch("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, updateAdmin);
adminRouter.delete("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, deleteAdminById);

adminRouter.post("/teacher/", adminAuthentication, fullAccessAdminAuthorization, createTeacher);
adminRouter.get("/teacher/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getTeachers);
adminRouter.get("/teacher/:id", adminAuthentication, readOnlyAdminAuthorization, getTeacherById);
adminRouter.patch("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, updateTeacher);
adminRouter.delete("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, deleteTeacherById);

adminRouter.post("/user/", adminAuthentication, fullAccessAdminAuthorization, createUser);
adminRouter.get("/user/list", adminAuthentication, readOnlyAdminAuthorization, pagingMiddleware, getUsers);
adminRouter.get("/user/:id", adminAuthentication, readOnlyAdminAuthorization, getUserById);
adminRouter.patch("/user/:id", adminAuthentication, fullAccessAdminAuthorization, updateUser);
adminRouter.delete("/user/:id", adminAuthentication, fullAccessAdminAuthorization, deleteUserById);

adminRouter.post("/group/", adminAuthentication, fullAccessAdminAuthorization, createGroup);
adminRouter.get("/group/list", adminAuthentication, fullAccessAdminAuthorization, pagingMiddleware, getGroups);
adminRouter.get("/group/:id", adminAuthentication, readOnlyAdminAuthorization, getGroupById);
adminRouter.patch("/group/:id", adminAuthentication, fullAccessAdminAuthorization, updateGroup);
adminRouter.delete("/group/:id", adminAuthentication, fullAccessAdminAuthorization, deleteGroupById);

export default adminRouter;
