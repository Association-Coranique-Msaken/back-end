import express from "express";
import { clearExpiredTokens, invalidateUserTokens } from "../controllers/tokensController";

const InvalidTokensRouter = express.Router();

InvalidTokensRouter.post("/clear-expired", clearExpiredTokens);
InvalidTokensRouter.post("/invalidate-user-tokens", invalidateUserTokens);

export default InvalidTokensRouter;
