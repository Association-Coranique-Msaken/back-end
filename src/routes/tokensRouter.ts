import express from "express";
import { clearExpiredTokens, unvalidateUserTokens } from "../controllers/tokensController";

const InvalidTokensRouter = express.Router();

InvalidTokensRouter.post("/clear-expired", clearExpiredTokens);
InvalidTokensRouter.post("/invalidate-user-tokens", unvalidateUserTokens);

export default InvalidTokensRouter;
