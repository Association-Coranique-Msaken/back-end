import { type NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/Responses";
import { AppErrors } from "../helpers/appErrors";

export const errorHandler = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppErrors.WithResponse) {
        return error.respond(res);
    }
    console.error(`Error: ${error.message}`);
    return Responses.InternalServerError(res);
};
