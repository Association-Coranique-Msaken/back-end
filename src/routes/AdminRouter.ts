import express from "express";
import {
    createAdmin,
    createFormativeYearGroup,
    createSummerGroup,
    createTeacher,
    createUser,
    deleteAdminById,
    deleteFormativeYearGroupById,
    deleteSummerGroupById,
    deleteTeacherById,
    deleteUserById,
    getAdminById,
    getAdmins,
    getFormativeYearGroupById,
    getFormativeYearGroups,
    getSummerGroupById,
    getSummerGroups,
    getTeacherById,
    getTeacherFormativeYearGroups,
    getTeacherSummerGroups,
    getTeachers,
    getUserById,
    getUsers,
    updateAdmin,
    updateFormativeYearGroupById,
    updateSummerGroupById,
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

adminRouter.post("/summer-group/", adminAuthentication, fullAccessAdminAuthorization, createSummerGroup);
adminRouter.get(
    "/summer-group/list",
    adminAuthentication,
    fullAccessAdminAuthorization,
    pagingMiddleware,
    getSummerGroups
);
adminRouter.get(
    "/summer-group/:teacherId",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    getTeacherSummerGroups
);
adminRouter.get("/summer-group/:id", adminAuthentication, readOnlyAdminAuthorization, getSummerGroupById);
adminRouter.patch("/summer-group/:id", adminAuthentication, fullAccessAdminAuthorization, updateSummerGroupById);
adminRouter.delete("/summer-group/:id", adminAuthentication, fullAccessAdminAuthorization, deleteSummerGroupById);

adminRouter.post("/formative-year-group/", adminAuthentication, fullAccessAdminAuthorization, createFormativeYearGroup);
adminRouter.get(
    "/formative-year-group/list",
    adminAuthentication,
    fullAccessAdminAuthorization,
    pagingMiddleware,
    getFormativeYearGroups
);
adminRouter.get(
    "/formative-year-group/:teacherId",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    getTeacherFormativeYearGroups
);
adminRouter.get(
    "/formative-year-group/:id",
    adminAuthentication,
    readOnlyAdminAuthorization,
    getFormativeYearGroupById
);
adminRouter.patch(
    "/formative-year-group/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    updateFormativeYearGroupById
);
adminRouter.delete(
    "/formative-year-group/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    deleteFormativeYearGroupById
);

export default adminRouter;
