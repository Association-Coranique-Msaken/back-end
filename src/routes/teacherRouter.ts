import express from "express";
import { teacherAuthentication } from "../middlewares/authMiddleware";
import { getGroups, updateData } from "../controllers/teacherController";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";

const teacherRouter = express.Router();

/**
 * @swagger
 * /api/v1/teacherapi:
 *   patch:
 *     summary: Update teacher.
 *     description: Requires teacher access token. Updates the teacher.
 *     tags: [teacherapi]
 */
teacherRouter.patch("/teacher", teacherAuthentication, updateData);

/**
 * @swagger
 * /api/v1/teacherapi/group/list:
 *   get:
 *     summary: Get teacher groups
 *     description: Requires teacher access token. Returns a list of teacher groups. Supports pagination parameters.
 *     tags: [teacherapi]
 */
teacherRouter.get("/group/list", teacherAuthentication, pagingMiddleware, getGroups);

export default teacherRouter;
