import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/responses";

export const adminAuthorization = (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminToken = res.locals.decodedToken;
        if (!adminToken) {
            throw new Error("Invalid token!");
        }
        if (!roles.includes(adminToken?.role)) {
            return Responses.Forbidden(res);
        }
        next();
    } catch (error: any) {
        return Responses.InternalServerError(res);
    }
};

export const readOnlyAdminAuthorization = adminAuthorization(["fullAccessAdmin", "limitedAccess", "readOnly"]);
export const fullAccessAdminAuthorization = adminAuthorization(["fullAccessAdmin"]);
