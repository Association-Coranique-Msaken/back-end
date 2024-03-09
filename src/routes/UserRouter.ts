import express from "express";
import { createUser, getUsers } from "../controllers/userController";
import { authentification, authorization } from "../middlewares/authMiddleware";

const userRouter = express.Router();
userRouter.use(authentification);
userRouter.post("/", authorization(["fullAccessAdmin"]), createUser); //TODO: add authentication and authorization admin
userRouter.get("/", getUsers);

export default userRouter;
