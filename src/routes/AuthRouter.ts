import express from "express";
import auth from "../controllers/authController";
const authRouter = express.Router();

authRouter.post("/admin/login", auth.adminLogin);
authRouter.post("/admin/signup", auth.adminSignup);

authRouter.post("/user/login", auth.userLogin);

authRouter.post("/teacher/login", auth.teacherLogin);
export default authRouter;
