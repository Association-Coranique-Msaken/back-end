import express from "express";
import { teacherAuthentication } from "../middlewares/authMiddleware";
import { getGroups, updateData } from "../controllers/teacherController";
import { pagingMiddleware } from "../middlewares/pagingMiddleware";

const teacherRouter = express.Router();

teacherRouter.patch("teacher", teacherAuthentication, updateData);
teacherRouter.get("/group/list", teacherAuthentication, pagingMiddleware, getGroups);

export default teacherRouter;
