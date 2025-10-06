import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/responses";

export const teacherWriteAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherToken = res.locals.decodedToken;
        if (!teacherToken) {
            throw new Error("Invalid token!");
        }
        if (!teacherToken.isActive) {
            return Responses.Forbidden(res);
        }
        next();
    } catch (error: any) {
        return Responses.InternalServerError(res);
    }
};
