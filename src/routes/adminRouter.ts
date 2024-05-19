import express from "express";
import {
    generateAdminResetPasswordLink,
    createAdmin,
    createGroup,
    createTeacher,
    createUser,
    deleteAdminById,
    deleteGroupById,
    deleteTeacherById,
    deleteUserById,
    enrollUserToGroup,
    getAdminById,
    getAdmins,
    getGroupById,
    getGroupUsers,
    getGroups,
    getTeacherById,
    getTeachers,
    getUserById,
    getUsers,
    updateAdmin,
    updateGroup,
    updateTeacher,
    updateUser,
    createCardForUser,
    getUserLastCard,
    regenerateTeacherPassword,
} from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { readOnlyAdminAuthorization, fullAccessAdminAuthorization } from "../middlewares/checkAdminRole";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";
import {
    adminListFilterMiddleware,
    groupListFilterMiddleware,
    teacherListFilterMiddleware,
    userListFilterMiddleware,
} from "../middlewares/filteringMiddleware";

const adminRouter = express.Router();

/**
 * @swagger
 * /api/v1/adminapi:
 *   post:
 *     summary: Create an admin.
 *     description: Requires admin access token with write access. Creates an admin.
 *     tags: [adminapi]
 */
adminRouter.post("/admin/", adminAuthentication, fullAccessAdminAuthorization, createAdmin);

/**
 * @swagger
 * /api/v1/adminapi/list:
 *   get:
 *     summary: Get admins.
 *     description: Requires admin access token. Get admins.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/admin/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    adminListFilterMiddleware,
    getAdmins
);

/**
 * @swagger
 * /api/v1/adminapi/admin{id}:
 *   get:
 *     summary: Get admin by id.
 *     description: Requires admin access token. Get admin by id.
 *     tags: [adminapi]
 */
adminRouter.get("/admin/:id", adminAuthentication, readOnlyAdminAuthorization, getAdminById);

/**
 * @swagger
 * /api/v1/adminapi/admin{id}:
 *   patch:
 *     summary: Update admin.
 *     description: Requires admin access token with write access. Update admin.
 *     tags: [adminapi]
 */
adminRouter.patch("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, updateAdmin);

/**
 * @swagger
 * /api/v1/adminapi/admin{id}:
 *   delete:
 *     summary: Delete admin.
 *     description: Requires admin access token with write access. Delete admin.
 *     tags: [adminapi]
 */
adminRouter.delete("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, deleteAdminById);

/**
 * @swagger
 * /api/v1/adminapi/admin/password-reset-link/{id}:
 *   post:
 *     summary: Generates password reset link for an admin user with id {id}.
 *     description: Requires admin access token. generates reset password link.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/admin/password-reset-link/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    generateAdminResetPasswordLink
);

/**
 * @swagger
 * /api/v1/adminapi/teacher{id}:
 *   post:
 *     summary: Create teacher.
 *     description: Requires admin access token with write access. Create a teacher.
 *     tags: [adminapi]
 */
adminRouter.post("/teacher/", adminAuthentication, fullAccessAdminAuthorization, createTeacher);

/**
 * @swagger
 * /api/v1/adminapi/teacher/list:
 *   get:
 *     summary: Get teachers.
 *     description: Requires admin access token with write access. Get teachers.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/teacher/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    teacherListFilterMiddleware,
    getTeachers
);

/**
 * @swagger
 * /api/v1/adminapi/teacher{id}:
 *   get:
 *     summary: Get teacher by id.
 *     description: Requires admin access token with write access. Get teacher by id.
 *     tags: [adminapi]
 */
adminRouter.get("/teacher/:id", adminAuthentication, readOnlyAdminAuthorization, getTeacherById);

/**
 * @swagger
 * /api/v1/adminapi/teacher{id}:
 *   patch:
 *     summary: Update teacher.
 *     description: Requires admin access token with write access. Update teacher.
 *     tags: [adminapi]
 */
adminRouter.patch("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, updateTeacher);

/**
 * @swagger
 * /api/v1/adminapi/teacher/{id}:
 *   delete:
 *     summary: Delete teacher by id.
 *     description: Requires admin access token with write access. Delete teacher by id.
 *     tags: [adminapi]
 */
adminRouter.delete("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, deleteTeacherById);

/**
 * @swagger
 * /api/v1/adminapi/teacher/password/{teacherId}:
 *   post:
 *     summary: resets teacher password.
 *     description: Requires admin access token with write access.
 *     tags: [adminapi]
 */
adminRouter.post(
    "/teacher/password/:teacherId",
    adminAuthentication,
    fullAccessAdminAuthorization,
    regenerateTeacherPassword
);

/**
 * @swagger
 * /api/v1/adminapi/user:
 *   post:
 *     summary: Create user.
 *     description: Requires admin access token with write access. Create user.
 *     tags: [adminapi]
 */
adminRouter.post("/user/", adminAuthentication, fullAccessAdminAuthorization, createUser);

/**
 * @swagger
 * /api/v1/adminapi/user/list:
 *   get:
 *     summary: Get users.
 *     description: Requires admin access token with write access. Get usesr.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/user/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    userListFilterMiddleware,
    getUsers
);

/**
 * @swagger
 * /api/v1/adminapi/user/{id}:
 *   get:
 *     summary: Get user by id.
 *     description: Requires admin access token with write access. Get user by id.
 *     tags: [adminapi]
 */
adminRouter.get("/user/:id", adminAuthentication, readOnlyAdminAuthorization, getUserById);

/**
 * @swagger
 * /api/v1/adminapi/user{id}:
 *   gepatcht:
 *     summary: Update user.
 *     description: Requires admin access token with write access. Update user.
 *     tags: [adminapi]
 */
adminRouter.patch("/user/:id", adminAuthentication, fullAccessAdminAuthorization, updateUser);

/**
 * @swagger
 * /api/v1/adminapi/user{id}:
 *   delete:
 *     summary: Delete user by id.
 *     description: Requires admin access token with write access. Delete user by id.
 *     tags: [adminapi]
 */
adminRouter.delete("/user/:id", adminAuthentication, fullAccessAdminAuthorization, deleteUserById);

/**
 * @swagger
 * /api/v1/adminapi/group:
 *   post:
 *     summary: Update a group.
 *     description: Requires admin access token. Updates a group.
 *     tags: [adminapi]
 */
adminRouter.post("/group/", adminAuthentication, fullAccessAdminAuthorization, createGroup);

/**
 * @swagger
 * /api/v1/adminapi/group/list:
 *   get:
 *     summary: Get groups.
 *     description: Requires admin access token. Get groups. Supports pagination.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/group/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    groupListFilterMiddleware,
    getGroups
);

/**
 * @swagger
 * /api/v1/adminapi/group/{id}:
 *   get:
 *     summary: Get a group by id.
 *     description: Requires admin access token. Gets a group by id.
 *     tags: [adminapi]
 */
adminRouter.get("/group/:id", adminAuthentication, readOnlyAdminAuthorization, getGroupById);

/**
 * @swagger
 * /api/v1/adminapi/group/{id}:
 *   patch:
 *     summary: update a group.
 *     description: Requires admin access token. Updates a group.
 *     tags: [adminapi]
 */
adminRouter.patch("/group/:id", adminAuthentication, fullAccessAdminAuthorization, updateGroup);

/**
 * @swagger
 * /api/v1/adminapi/group/{id}:
 *   delete:
 *     summary: Delete a group by id.
 *     description: Requires admin access token. Deletes a group by id.
 *     tags: [adminapi]
 */
adminRouter.delete("/group/:id", adminAuthentication, fullAccessAdminAuthorization, deleteGroupById);

/**
 * @swagger
 * /api/v1/adminapi/group/user/list/{id}:
 *   get:
 *     summary: Gets a list of a user groups.
 *     description: Requires admin access token. Gets a list of a user groups.
 *     tags: [adminapi]
 */
adminRouter.get(
    "/group/user/list/:id",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    getGroupUsers
);

/**
 * @swagger
 * /api/v1/adminapi/group/user/enroll/:
 *   post:
 *     summary: Enrolls a user to a group.
 *     description: Requires admin access token. Enrolls a user to a group.
 *     tags: [adminapi]
 */
adminRouter.post("/group/user/enroll/", adminAuthentication, fullAccessAdminAuthorization, enrollUserToGroup);

/**
 * @swagger
 * /api/v1/adminapi/card/user/:
 *   post:
 *     summary: Create card for user.
 *     description: Creates card for user.
 *     tags: [adminapi]
 */
adminRouter.post("/card/user/", adminAuthentication, fullAccessAdminAuthorization, createCardForUser);

/**
 * @swagger
 * /api/v1/adminapi/card/user/{userId}:
 *   get:
 *     summary: Get user last card by userId.
 *     description: Get user last card by userId. null is returned if there is no card.
 *     tags: [adminapi]
 */
adminRouter.get("/card/user/:userId", adminAuthentication, readOnlyAdminAuthorization, getUserLastCard);

export default adminRouter;
