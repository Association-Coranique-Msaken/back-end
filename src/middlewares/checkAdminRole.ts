import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/Responses";

export const adminAuthorization = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminToken = res.locals.decodedToken;
        if (!adminToken) {
            throw new Error("Invalid token!");
        }
        if (adminToken?.role != role) {
            return Responses.Forbidden(res);
        }
        next();
    } catch (error: any) {
        console.log(error);
        return Responses.InternalServerError(res);
    }
};
