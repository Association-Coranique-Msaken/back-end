import express from "express";
import auth from "../controllers/authController";
import { genericAuthentication } from "../middlewares/authMiddleware";
const authRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Admin login.
 *     description: Admin login.
 *     tags: [auth]
 */
authRouter.post("/admin/login", auth.adminLogin);

// Hidden Api for testing purposes only.
authRouter.post("/admin/signup", auth.adminSignup);

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: User login.
 *     description: User login.
 *     tags: [auth]
 */
authRouter.post("/user/login", auth.userLogin);

/**
 * @swagger
 * /api/v1/auth/teacher/login:
 *   post:
 *     summary: Teacher login.
 *     description: Teacher login.
 *     tags: [auth]
 */
authRouter.post("/teacher/login", auth.teacherLogin);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout.
 *     description: Logout.
 *     tags: [auth]
 */
authRouter.post("/logout", genericAuthentication, auth.logout);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh token.
 *     description: Refresh token.
 *     tags: [auth]
 */
authRouter.post("/refresh-token/", auth.refreshToken);

export default authRouter;
