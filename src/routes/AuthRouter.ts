import express from "express";
import auth from "../controllers/authController";
import { genericAuthentication } from "../middlewares/authMiddleware";
const authRouter = express.Router();

authRouter.post("/admin/login", auth.adminLogin);
authRouter.post("/admin/signup", auth.adminSignup);
authRouter.post("/user/login", auth.userLogin);
authRouter.post("/teacher/login", auth.teacherLogin);
authRouter.post("/logout", genericAuthentication, auth.logout);

export default authRouter;
