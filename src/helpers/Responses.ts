import { type Response } from "express";
import type Joi from "joi";

export namespace Responses {
    export const OperationSuccess = (response: Response) => {
        return response.status(200).json({ succss: true, message: "Operation completed successfully." });
    };

    export const FetchSucess = (response: Response, data: any) => {
        return response.status(200).json({ succss: true, message: "Data successfully fetched.", data });
    };

    export const LoginSuccess = (response: Response, data: any, accessToken: string, refreshToken: string) => {
        return response.status(200).json({
            succss: true,
            message: "Login Successfull.",
            data,
            accessToken,
            refreshToken,
        });
    };

    export const LogoutSucess = (response: Response) => {
        return response.status(200).json({ success: true, message: "Logout completed successfully." });
    };

    export const DeleteSuccess = (response: Response) => {
        return response.status(200).json({ success: true, message: "Item(s) successfully deleted." });
    };

    export const UpdateSucess = (response: Response) => {
        return response.status(201).json({ success: true, message: "Data updated." });
    };

    export const CreateSucess = (response: Response, data: any) => {
        return response.status(201).json({ success: true, message: "Data created.", data });
    };

    export const BadRequest = (response: Response, info: string = "Bad Request.") => {
        return response.status(400).json({ succss: false, message: info });
    };

    export const ValidationBadRequest = (response: Response, error: Joi.ValidationError) => {
        return response.status(400).json({ succss: false, message: error.details[0].message });
    };

    export const AlreadyDeleted = (response: Response) => BadRequest(response, "item already deleted.");

    export const BadCredentials = (response: Response) => Unauthorized(response, "Bad Credentials.");

    export const Unauthorized = (response: Response, info: string = "Unauthorized.") => {
        return response.status(401).json({ succss: false, message: info });
    };

    export const Forbidden = (response: Response, info: string = "Forbidden.") => {
        return response.status(404).json({ succss: false, message: info });
    };

    export const NotFound = (response: Response, info: string = "Data not found.") => {
        return response.status(404).json({ succss: false, message: info });
    };

    export const AlreadyExists = (response: Response, info: string = "Item already exists.") => {
        return response.status(409).json({ succss: false, message: info });
    };

    export const InternalServerError = (response: Response, info: string = "Internal Server error.") => {
        return response.status(500).json({ succss: false, message: info });
    };
}
