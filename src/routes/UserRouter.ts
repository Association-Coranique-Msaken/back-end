import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController";
import { adminAuthentification } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const userRouter = express.Router();

userRouter.post("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), createUser);

userRouter.get("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), getUsers);

userRouter.get("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), getUserById);

userRouter.patch("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), updateUser);

userRouter.delete("/:id", adminAuthentification, adminAuthorization("fullAccessAdmin"), deleteUser);

export default userRouter;
