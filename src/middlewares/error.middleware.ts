import { NextFunction, Request, Response } from "express";
import { Responses } from "../helpers/Responses";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${error.message}`);
    return Responses.InternalServerError(res);
};
