import express from "express";
import auth from "../controllers/authController";
import { genericAuthentication } from "../middlewares/authMiddleware";
import { authRateLimiter, passwordResetRateLimiter, tokenRefreshRateLimiter } from "../middlewares/rateLimitMiddleware";
const authRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Admin login.
 *     description: Admin login.
 *     tags: [auth]
 */
authRouter.post("/admin/login", authRateLimiter, auth.adminLogin);

// Hidden Api for testing purposes only.
authRouter.post("/admin/signup", authRateLimiter, auth.adminSignup);

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: User login.
 *     description: User login.
 *     tags: [auth]
 */
authRouter.post("/user/login", authRateLimiter, auth.userLogin);

/**
 * @swagger
 * /api/v1/auth/teacher/login:
 *   post:
 *     summary: Teacher login.
 *     description: Teacher login.
 *     tags: [auth]
 */
authRouter.post("/teacher/login", authRateLimiter, auth.teacherLogin);

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
authRouter.post("/refresh-token/", tokenRefreshRateLimiter, auth.refreshToken);

/**
 * @swagger
 * /api/v1/auth/admin/reset-password/:
 *   post:
 *     summary: reset admin password.
 *     description: reset admin password with a reset token.
 *     tags: [auth]
 */
authRouter.post("/admin/reset-password/", passwordResetRateLimiter, auth.resetAdminPassword);

export default authRouter;
