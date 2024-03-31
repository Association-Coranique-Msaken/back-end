import { type NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/Responses";
import { AppErrors } from "../helpers/appErrors";
import { QueryFailedError } from "typeorm";

export const errorHandler = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppErrors.WithResponse) {
        return error.respond(res);
    }
    if (error instanceof QueryFailedError) {
        switch (error.driverError.code) {
            case "ER_DUP_ENTRY":
                return Responses.InternalServerError(res, "Item already Exists");
            case "ER_BAD_FIELD_ERROR":
                // catch paging errors
                if (req.query.orderBy && /^Unknown column '.*' in 'order clause'$/.test(error.driverError.sqlMessage)) {
                    return Responses.BadRequest(res, `Unknown orderBy field '${req.query.orderBy}'`);
                }
                break;
        }
    }
    console.error(`Error: ${error.message}`);
    return Responses.InternalServerError(res);
};
