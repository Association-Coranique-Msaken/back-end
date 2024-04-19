import express from "express";
import { userAuthentication } from "../middlewares/authMiddleware";
import { updateData } from "../controllers/userController";

const userRouter = express.Router();

/**
 * @swagger
 * /api/v1/userapi:
 *   patch:
 *     summary: Update user.
 *     description: Requires user access token. Updates the user.
 *     tags: [userapi]
 */
userRouter.patch("/user", userAuthentication, updateData);

export default userRouter;
