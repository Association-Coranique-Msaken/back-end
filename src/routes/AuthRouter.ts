import express from "express";
import auth from "../controllers/authController";
const authRouter = express.Router();

authRouter.post("/admin/login", auth.adminLogin);
authRouter.post("/admin/signup", auth.adminSignup);

authRouter.post("/user/login", auth.userLogin);
export default authRouter;
