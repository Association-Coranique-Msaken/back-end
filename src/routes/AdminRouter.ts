import express from "express";
import { createAdmin, getAdmin } from "../controllers/adminController";
import { adminAuthentication } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const adminRouter = express.Router();

adminRouter.get("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), getAdmin);
adminRouter.put("/", adminAuthentication, adminAuthorization("fullAccessAdmin"), createAdmin);

export default adminRouter;
