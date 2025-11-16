import express from "express";
import auth from "../controllers/authController";
import { genericAuthentication } from "../middlewares/authMiddleware";
import { authRateLimiter, passwordResetRateLimiter, tokenRefreshRateLimiter } from "../middlewares/rateLimitMiddleware";
const authRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate admin with username and password.
 *     tags: [auth]
 */
authRouter.post("/admin/login", authRateLimiter, auth.adminLogin);

/**
 * @swagger
 * /api/v1/auth/admin/signup:
 *   post:
 *     summary: Admin Signup
 *     description: Register a new admin account (testing only).
 *     tags: [auth]
 */
authRouter.post("/admin/signup", authRateLimiter, auth.adminSignup);

/**
 * @swagger
 * /api/v1/auth/user/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user with identifier and birth date.
 *     tags: [auth]
 */
authRouter.post("/user/login", authRateLimiter, auth.userLogin);

/**
 * @swagger
 * /api/v1/auth/teacher/login:
 *   post:
 *     summary: Teacher Login
 *     description: Authenticate teacher with code and password.
 *     tags: [auth]
 */
authRouter.post("/teacher/login", authRateLimiter, auth.teacherLogin);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Invalidate current authentication token.
 *     tags: [auth]
 */
authRouter.post("/logout", genericAuthentication, auth.logout);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh Token
 *     description: Get new access token using refresh token.
 *     tags: [auth]
 */
authRouter.post("/refresh-token/", tokenRefreshRateLimiter, auth.refreshToken);

/**
 * @swagger
 * /api/v1/auth/admin/reset-password:
 *   post:
 *     summary: Reset Admin Password
 *     description: Reset admin password using a reset token.
 *     tags: [auth]
 */
authRouter.post("/admin/reset-password/", passwordResetRateLimiter, auth.resetAdminPassword);

export default authRouter;
