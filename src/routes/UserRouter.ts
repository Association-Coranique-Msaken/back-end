import express from "express";
import { userAuthentication } from "../middlewares/authMiddleware";
import { updateData } from "../controllers/userController";

const userRouter = express.Router();

userRouter.patch("teacher", userAuthentication, updateData);

export default userRouter;
