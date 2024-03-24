import express from "express";
import { createAdmin, getAdmin } from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import {
    adminAuthorization,
    readOnlyAdminAuthorization,
    fullAccessAdminAuthorization,
} from "../middlewares/checkAdminRole";

const adminRouter = express.Router();

adminRouter.get("/", adminAuthentication, readOnlyAdminAuthorization, getAdmin);
adminRouter.put("/", adminAuthentication, fullAccessAdminAuthorization, createAdmin);

export default adminRouter;
