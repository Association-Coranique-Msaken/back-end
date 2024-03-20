import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const userRouter = express.Router();

userRouter.put("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), createUser);

userRouter.get("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), getUsers);

userRouter.get("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), getUserById);

userRouter.patch("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), updateUser);

userRouter.delete("/:id", adminAuthentication, adminAuthorization("fullAccessAdmin"), deleteUser);

export default userRouter;
