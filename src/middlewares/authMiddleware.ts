import { type Request, type Response, type NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Responses } from "../helpers/Responses";
import {
    type AdminToken,
    type EntityToken,
    type TeacherToken,
    Tokens,
    type UserToken,
    type TokenType,
} from "../helpers/TokenTypes";
import { invalidTokensCache } from "../helpers/InvalidTokensCache";

dotenv.config();

export const genericAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return Responses.Unauthorized(res);
    }
    const token: string = header.split(" ")[1];
    try {
        const decodedToken = Tokens.verifyToken(token);
        await invalidTokensCache.checkValidity(token, decodedToken.id, decodedToken.expiration);
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
            const decodedToken = Tokens.DecodeAs<T>(typeName, token);
            await invalidTokensCache.checkValidity(token, decodedToken.id, decodedToken.expiration);
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

export const adminAuthentication = baseAuthentication<AdminToken>("Admin");
export const userAuthentication = baseAuthentication<UserToken>("User");
export const teacherAuthentication = baseAuthentication<TeacherToken>("Teacher");
