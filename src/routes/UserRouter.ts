import express from "express";
import { adminAuthentication } from "../middlewares/authMiddleware";
import {
    adminAuthorization,
    fullAccessAdminAuthorization,
    readOnlyAdminAuthorization,
} from "../middlewares/checkAdminRole";

const userRouter = express.Router();

export default userRouter;
