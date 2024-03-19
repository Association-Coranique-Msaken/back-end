import express from "express";
import { createAdmin, getAdmin } from "../controllers/adminController";
import { adminAuthentification } from "../middlewares/authMiddleware";
import { adminAuthorization } from "../middlewares/checkAdminRole";

const adminRouter = express.Router();

adminRouter.get("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), getAdmin);
adminRouter.post("/", adminAuthentification, adminAuthorization("fullAccessAdmin"), createAdmin);

export default adminRouter;
