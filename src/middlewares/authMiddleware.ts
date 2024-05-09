import { type Request, type Response, type NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Responses } from "../helpers/responses";
import {
    type AdminToken,
    type EntityToken,
    type TeacherToken,
    Tokens,
    type UserToken,
    type TokenType,
    TOKEN_TYPE_ADMIN,
    TOKEN_TYPE_USER,
    TOKEN_TYPE_TEACHER,
} from "../helpers/tokens/tokenTypes";
import { AccessTokenRepo } from "../helpers/tokens/tokensRepository";

dotenv.config();

export const genericAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return Responses.Unauthorized(res);
    }
    const token: string = header.split(" ")[1];
    try {
        const decodedToken = Tokens.verifyAccessToken(token);
        await AccessTokenRepo.checkValidity(token, decodedToken.id, decodedToken.expiration);
        res.locals.decodedToken = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return Responses.Unauthorized(res);
        }
        return Responses.BadRequest(res);
    }
};

const baseAuthentication =
    <T extends EntityToken>(typeName: TokenType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header) {
            return Responses.Unauthorized(res);
        }
        const token: string = header.split(" ")[1];
        try {
            const decodedToken = Tokens.DecodeAccessTokenAs<T>(typeName, token);
            await AccessTokenRepo.checkValidity(token, decodedToken.id, decodedToken.expiration);
            res.locals.decodedToken = decodedToken;
            res.locals.token = token;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return Responses.Unauthorized(res);
            }
            return Responses.BadRequest(res);
        }
    };

export const adminAuthentication = baseAuthentication<AdminToken>(TOKEN_TYPE_ADMIN);
export const userAuthentication = baseAuthentication<UserToken>(TOKEN_TYPE_USER);
export const teacherAuthentication = baseAuthentication<TeacherToken>(TOKEN_TYPE_TEACHER);
