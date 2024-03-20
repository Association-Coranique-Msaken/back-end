import express from "express";
import { clearExpiredTokensRequest, unvalidateUserTokensRequest } from "../controllers/invalidTokensController";

const InvalidTokensRouter = express.Router();

InvalidTokensRouter.post("/clear-expired", clearExpiredTokensRequest);
InvalidTokensRouter.post("/invalidate-user-tokens", unvalidateUserTokensRequest);

export default InvalidTokensRouter;
