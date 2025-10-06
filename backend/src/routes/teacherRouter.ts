import express from "express";
import { teacherAuthentication } from "../middlewares/authMiddleware";
import { getGroups, updateData } from "../controllers/teacherController";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";
import { teacherWriteAuthorization } from "../middlewares/teacherWriteAuthorization";

const teacherRouter = express.Router();

/**
 * @swagger
 * /api/v1/teacher-api:
 *   patch:
 *     summary: Update teacher.
 *     description: Requires teacher access token. Updates the teacher.
 *     tags: [teacher-api]
 */
teacherRouter.patch("/teacher", teacherAuthentication, teacherWriteAuthorization, updateData);

/**
 * @swagger
 * /api/v1/teacher-api/group/list:
 *   get:
 *     summary: Get teacher groups
 *     description: Requires teacher access token. Returns a list of teacher groups. Supports pagination parameters.
 *     tags: [teacher-api]
 */
teacherRouter.get("/group/list", teacherAuthentication, pagingMiddleware, getGroups);

export default teacherRouter;
