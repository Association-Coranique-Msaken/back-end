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
    createCompetition,
    getCompetitions,
    getCompetitionById,
    updateCompetition,
    deleteCompetitionById,
    deleteCompetitionRegistrationById,
    updateCompetitionRegistrationById,
    getCompetitionRegistrationById,
    getCompetitionRegistrations,
    createCompetitionRegistration,
} from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { readOnlyAdminAuthorization, fullAccessAdminAuthorization } from "../middlewares/checkAdminRole";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";
import {
    adminListFilterMiddleware,
    competitionListFilterMiddleware,
    competitionRegistrationListFilterMiddleware,
    groupListFilterMiddleware,
    teacherListFilterMiddleware,
    userListFilterMiddleware,
} from "../middlewares/filteringMiddleware";

const adminRouter = express.Router();

/**
 * @swagger
 * /api/v1/admin-api/admin:
 *   post:
 *     summary: Create an admin.
 *     description: Requires admin access token with write access. Creates an admin.
 *     tags: [admin-api]
 */
adminRouter.post("/admin/", adminAuthentication, fullAccessAdminAuthorization, createAdmin);

/**
 * @swagger
 * /api/v1/admin-api/admin/list:
 *   get:
 *     summary: Get admins.
 *     description: Requires admin access token. Get admins.
 *     tags: [admin-api]
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
 * /api/v1/admin-api/admin/{id}:
 *   get:
 *     summary: Get admin by id.
 *     description: Requires admin access token. Get admin by id.
 *     tags: [admin-api]
 */
adminRouter.get("/admin/:id", adminAuthentication, readOnlyAdminAuthorization, getAdminById);

/**
 * @swagger
 * /api/v1/admin-api/admin/{id}:
 *   patch:
 *     summary: Update admin.
 *     description: Requires admin access token with write access. Update admin.
 *     tags: [admin-api]
 */
adminRouter.patch("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, updateAdmin);

/**
 * @swagger
 * /api/v1/admin-api/admin/{id}:
 *   delete:
 *     summary: Delete admin.
 *     description: Requires admin access token with write access. Delete admin.
 *     tags: [admin-api]
 */
adminRouter.delete("/admin/:id", adminAuthentication, fullAccessAdminAuthorization, deleteAdminById);

/**
 * @swagger
 * /api/v1/admin-api/admin/password-reset-link/{id}:
 *   post:
 *     summary: Generates password reset link for an admin user with id {id}.
 *     description: Requires admin access token. generates reset password link.
 *     tags: [admin-api]
 */
adminRouter.get(
    "/admin/password-reset-link/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    generateAdminResetPasswordLink
);

/**
 * @swagger
 * /api/v1/admin-api/teacher:
 *   post:
 *     summary: Create teacher.
 *     description: Requires admin access token with write access. Create a teacher.
 *     tags: [admin-api]
 */
adminRouter.post("/teacher/", adminAuthentication, fullAccessAdminAuthorization, createTeacher);

/**
 * @swagger
 * /api/v1/admin-api/teacher/list:
 *   get:
 *     summary: Get teachers.
 *     description: Requires admin access token with write access. Get teachers.
 *     tags: [admin-api]
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
 * /api/v1/admin-api/teacher/{id}:
 *   get:
 *     summary: Get teacher by id.
 *     description: Requires admin access token with write access. Get teacher by id.
 *     tags: [admin-api]
 */
adminRouter.get("/teacher/:id", adminAuthentication, readOnlyAdminAuthorization, getTeacherById);

/**
 * @swagger
 * /api/v1/admin-api/teacher/{id}:
 *   patch:
 *     summary: Update teacher.
 *     description: Requires admin access token with write access. Update teacher.
 *     tags: [admin-api]
 */
adminRouter.patch("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, updateTeacher);

/**
 * @swagger
 * /api/v1/admin-api/teacher/{id}:
 *   delete:
 *     summary: Delete teacher by id.
 *     description: Requires admin access token with write access. Delete teacher by id.
 *     tags: [admin-api]
 */
adminRouter.delete("/teacher/:id", adminAuthentication, fullAccessAdminAuthorization, deleteTeacherById);

/**
 * @swagger
 * /api/v1/admin-api/teacher/password/{teacherId}:
 *   post:
 *     summary: resets teacher password.
 *     description: Requires admin access token with write access.
 *     tags: [admin-api]
 */
adminRouter.post(
    "/teacher/password/:teacherId",
    adminAuthentication,
    fullAccessAdminAuthorization,
    regenerateTeacherPassword
);

/**
 * @swagger
 * /api/v1/admin-api/user:
 *   post:
 *     summary: Create user.
 *     description: Requires admin access token with write access. Create user.
 *     tags: [admin-api]
 */
adminRouter.post("/user/", adminAuthentication, fullAccessAdminAuthorization, createUser);

/**
 * @swagger
 * /api/v1/admin-api/user/list:
 *   get:
 *     summary: Get users.
 *     description: Requires admin access token with write access. Get user.
 *     tags: [admin-api]
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
 * /api/v1/admin-api/user/{id}:
 *   get:
 *     summary: Get user by id.
 *     description: Requires admin access token with write access. Get user by id.
 *     tags: [admin-api]
 */
adminRouter.get("/user/:id", adminAuthentication, readOnlyAdminAuthorization, getUserById);

/**
 * @swagger
 * /api/v1/admin-api/user/{id}:
 *   patch:
 *     summary: Update user.
 *     description: Requires admin access token with write access. Update user.
 *     tags: [admin-api]
 */
adminRouter.patch("/user/:id", adminAuthentication, fullAccessAdminAuthorization, updateUser);

/**
 * @swagger
 * /api/v1/admin-api/user/{id}:
 *   delete:
 *     summary: Delete user by id.
 *     description: Requires admin access token with write access. Delete user by id.
 *     tags: [admin-api]
 */
adminRouter.delete("/user/:id", adminAuthentication, fullAccessAdminAuthorization, deleteUserById);

/**
 * @swagger
 * /api/v1/admin-api/group:
 *   post:
 *     summary: Update a group.
 *     description: Requires admin access token. Updates a group.
 *     tags: [admin-api]
 */
adminRouter.post("/group/", adminAuthentication, fullAccessAdminAuthorization, createGroup);

/**
 * @swagger
 * /api/v1/admin-api/group/list:
 *   get:
 *     summary: Get groups.
 *     description: Requires admin access token. Get groups. Supports pagination.
 *     tags: [admin-api]
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
 * /api/v1/admin-api/group/{id}:
 *   get:
 *     summary: Get a group by id.
 *     description: Requires admin access token. Gets a group by id.
 *     tags: [admin-api]
 */
adminRouter.get("/group/:id", adminAuthentication, readOnlyAdminAuthorization, getGroupById);

/**
 * @swagger
 * /api/v1/admin-api/group/{id}:
 *   patch:
 *     summary: update a group.
 *     description: Requires admin access token. Updates a group.
 *     tags: [admin-api]
 */
adminRouter.patch("/group/:id", adminAuthentication, fullAccessAdminAuthorization, updateGroup);

/**
 * @swagger
 * /api/v1/admin-api/group/{id}:
 *   delete:
 *     summary: Delete a group by id.
 *     description: Requires admin access token. Deletes a group by id.
 *     tags: [admin-api]
 */
adminRouter.delete("/group/:id", adminAuthentication, fullAccessAdminAuthorization, deleteGroupById);

/**
 * @swagger
 * /api/v1/admin-api/group/user/list/{id}:
 *   get:
 *     summary: Gets a list of a user groups.
 *     description: Requires admin access token. Gets a list of a user groups.
 *     tags: [admin-api]
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
 * /api/v1/admin-api/group/user/enroll:
 *   post:
 *     summary: Enrolls a user to a group.
 *     description: Requires admin access token. Enrolls a user to a group.
 *     tags: [admin-api]
 */
adminRouter.post("/group/user/enroll/", adminAuthentication, fullAccessAdminAuthorization, enrollUserToGroup);

/**
 * @swagger
 * /api/v1/admin-api/card/user:
 *   post:
 *     summary: Create card for user.
 *     description: Creates card for user.
 *     tags: [admin-api]
 */
adminRouter.post("/card/user/", adminAuthentication, fullAccessAdminAuthorization, createCardForUser);

/**
 * @swagger
 * /api/v1/admin-api/card/user/{userId}:
 *   get:
 *     summary: Get user last card by userId.
 *     description: Get user last card by userId. null is returned if there is no card.
 *     tags: [admin-api]
 */
adminRouter.get("/card/user/:userId", adminAuthentication, readOnlyAdminAuthorization, getUserLastCard);

/**
 * @swagger
 * /api/v1/admin-api/competition:
 *   post:
 *     summary: Create a competition.
 *     description: Requires admin access token with write access. Creates a new competition.
 *     tags: [admin-api]
 */
adminRouter.post("/competition/", adminAuthentication, fullAccessAdminAuthorization, createCompetition);

/**
 * @swagger
 * /api/v1/admin-api/competition/list:
 *   get:
 *     summary: Get competitions.
 *     description: Requires admin access token. Get competitions.
 *     tags: [admin-api]
 */
adminRouter.get(
    "/competition/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    competitionListFilterMiddleware,
    getCompetitions
);

/**
 * @swagger
 * /api/v1/admin-api/competition/{id}:
 *   get:
 *     summary: Get competition by id.
 *     description: Requires admin access token. Get competition by id.
 *     tags: [admin-api]
 */
adminRouter.get("/competition/:id", adminAuthentication, readOnlyAdminAuthorization, getCompetitionById);

/**
 * @swagger
 * /api/v1/admin-api/competition/{id}:
 *   patch:
 *     summary: Update competition.
 *     description: Requires admin access token with write access. Update competition.
 *     tags: [admin-api]
 */
adminRouter.patch("/competition/:id", adminAuthentication, fullAccessAdminAuthorization, updateCompetition);

/**
 * @swagger
 * /api/v1/admin-api/competition/{id}:
 *   delete:
 *     summary: Delete competition.
 *     description: Requires admin access token with write access. Delete competition.
 *     tags: [admin-api]
 */
adminRouter.delete("/competition/:id", adminAuthentication, fullAccessAdminAuthorization, deleteCompetitionById);

/**
 * @swagger
 * /api/v1/admin-api/competition/registration:
 *   post:
 *     summary: Create a competition registration.
 *     description: Requires admin access token with write access. Creates a new competition registration.
 *     tags: [admin-api]
 */
adminRouter.post(
    "/competition/registration/",
    adminAuthentication,
    fullAccessAdminAuthorization,
    createCompetitionRegistration
);

/**
 * @swagger
 * /api/v1/admin-api/competition/registration/list:
 *   get:
 *     summary: Get competition registrations.
 *     description: Requires admin access token. Get competition registrations.
 *     tags: [admin-api]
 */
adminRouter.get(
    "/competition/registration/list",
    adminAuthentication,
    readOnlyAdminAuthorization,
    pagingMiddleware,
    competitionRegistrationListFilterMiddleware,
    getCompetitionRegistrations
);

/**
 * @swagger
 * /api/v1/admin-api/competition/registration/{id}:
 *   get:
 *     summary: Get competition registration by id.
 *     description: Requires admin access token. Get competition registration by id.
 *     tags: [admin-api]
 */
adminRouter.get(
    "/competition/registration/:id",
    adminAuthentication,
    readOnlyAdminAuthorization,
    getCompetitionRegistrationById
);

/**
 * @swagger
 * /api/v1/admin-api/competition/registration/{id}:
 *   patch:
 *     summary: Update competition registration.
 *     description: Requires admin access token with write access. Update competition registration.
 *     tags: [admin-api]
 */
adminRouter.patch(
    "/competition/registration/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    updateCompetitionRegistrationById
);

/**
 * @swagger
 * /api/v1/admin-api/competition/registration/{id}:
 *   delete:
 *     summary: Delete competition registration.
 *     description: Requires admin access token with write access. Delete competition registration.
 *     tags: [admin-api]
 */
adminRouter.delete(
    "/competition/registration/:id",
    adminAuthentication,
    fullAccessAdminAuthorization,
    deleteCompetitionRegistrationById
);

export default adminRouter;
