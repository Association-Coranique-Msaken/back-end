import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { Tokens } from "../entities/Tokens";
import { Responses } from "../helpers/responses";
import { AccessTokenRepo, RefreshTokenRepo } from "../helpers/tokens/tokensRepository";

export const clearExpiredTokens = async (req: Request, res: Response) => {
    try {
        await clearExpiredTokensFromDB();
        return Responses.DeleteSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const unvalidateUserTokens = async (req: Request, res: Response) => {
    if (!req.body?.id) {
        return Responses.BadRequest(res);
    }
    // TODO: check if user exists in db maybe ?
    try {
        await AccessTokenRepo.blacklistAll(req.body.id);
        await RefreshTokenRepo.blacklistAll(req.body.id);
        return Responses.OperationSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const clearExpiredTokensFromDB = async () => {
    return await appDataSource
        .createQueryBuilder()
        .delete()
        .from(Tokens)
        .where("expiration > CURRENT_TIMESTAMP")
        .execute();
};
