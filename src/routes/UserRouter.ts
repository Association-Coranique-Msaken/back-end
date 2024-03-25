import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import {
    adminAuthorization,
    fullAccessAdminAuthorization,
    readOnlyAdminAuthorization,
} from "../middlewares/checkAdminRole";

const userRouter = express.Router();

userRouter.put("/", adminAuthentication, fullAccessAdminAuthorization, createUser);
userRouter.get("/", adminAuthentication, readOnlyAdminAuthorization, getUsers);
userRouter.get("/:id", adminAuthentication, readOnlyAdminAuthorization, getUserById);
userRouter.patch("/:id", adminAuthentication, fullAccessAdminAuthorization, updateUser);
userRouter.delete("/:id", adminAuthentication, fullAccessAdminAuthorization, deleteUser);

export default userRouter;
