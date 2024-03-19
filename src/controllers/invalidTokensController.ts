import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { InvalidTokens } from "../entities/InvalidTokens";
import { Responses } from "../helpers/Responses";
import { invalidTokensCache } from "../helpers/InvalidTokensCache";

export const clearExpiredTokensRequest = async (req: Request, res: Response) => {
    try {
        await clearExpiredTokensFromDB();
        return Responses.DeleteSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const unvalidateUserTokensRequest = async (req: Request, res: Response) => {
    if (!req.body?.identifier) {
        return Responses.BadRequest(res);
    }
    // TODO: check if user exists in db maybe ?
    try {
        await invalidTokensCache.invalidateAllUserTokens(req.body.identifier);
        return Responses.OperationSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const clearExpiredTokensFromDB = async () => {
    return await appDataSource
        .createQueryBuilder()
        .delete()
        .from(InvalidTokens)
        .where("expiration > CURRENT_TIMESTAMP")
        .execute();
};
