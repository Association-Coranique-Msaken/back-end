import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController";
import { adminAuthentification } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const userRouter = express.Router();

userRouter.post("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), createUser);

userRouter.get("/", getUsers);

userRouter.get("/:id", getUserById);

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
