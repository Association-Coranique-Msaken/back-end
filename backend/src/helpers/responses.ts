import { type Response } from "express";
import type Joi from "joi";
import { PageDto } from "../DTOs/paging/pageDto";
import { TokenResultDto } from "../DTOs/tokenResultDto";
import type { ApiResponse, LoginResponse } from "@shared/types";

export namespace Responses {
    export const OperationSuccess = <T = any>(response: Response, data?: T): Response<ApiResponse<T>> => {
        return response.status(200).json({ success: true, message: "Operation completed successfully.", data });
    };

    export const FetchSuccess = <T = any>(response: Response, data: T): Response<ApiResponse<T>> => {
        return response.status(200).json({ success: true, message: "Data successfully fetched.", data });
    };

    export const FetchPagedSuccess = <T>(response: Response, pagingInfo: PageDto<T>): Response<ApiResponse<T[]>> => {
        return response.status(200).json({
            success: true,
            message: "Data successfully fetched.",
            data: pagingInfo.data,
            meta: pagingInfo.meta,
        });
    };

    export const LoginSuccess = <T = any>(
        response: Response,
        data: T,
        tokenResult: TokenResultDto
    ): Response<LoginResponse<T>> => {
        return response.status(200).json({
            success: true,
            message: "Login Successful.",
            data,
            ...tokenResult,
        });
    };

    export const LogoutSuccess = (response: Response): Response<ApiResponse<void>> => {
        return response.status(200).json({ success: true, message: "Logout completed successfully." });
    };

    export const DeleteSuccess = (response: Response): Response<ApiResponse<void>> => {
        return response.status(200).json({ success: true, message: "Item(s) successfully deleted." });
    };

    export const UpdateSuccess = <T = any>(response: Response, data?: T): Response<ApiResponse<T>> => {
        return response.status(201).json({ success: true, message: "Data updated.", data });
    };

    export const CreateSuccess = <T = any>(response: Response, data: T): Response<ApiResponse<T>> => {
        return response.status(201).json({ success: true, message: "Data created.", data });
    };

    export const RefreshTokenSuccess = <T = any>(
        response: Response,
        data: T,
        tokenResult: TokenResultDto
    ): Response<LoginResponse<T>> => {
        return response.status(200).json({
            success: true,
            message: "Token refreshed successfully.",
            data,
            ...tokenResult,
        });
    };

    export const BadRequest = (response: Response, info: string = "Bad Request.") => {
        return response.status(400).json({ success: false, message: info });
    };

    export const ValidationBadRequest = (response: Response, error: Joi.ValidationError) => {
        return response.status(400).json({ success: false, message: error.details[0].message });
    };

    export const AlreadyDeleted = (response: Response) => BadRequest(response, "item already deleted.");

    export const BadCredentials = (response: Response) => Unauthorized(response, "Bad Credentials.");

    export const Unauthorized = (response: Response, info: string = "Unauthorized.") => {
        return response.status(401).json({ success: false, message: info });
    };

    export const Forbidden = (response: Response, info: string = "Forbidden.") => {
        return response.status(404).json({ success: false, message: info });
    };

    export const NotFound = (response: Response, info: string = "Data not found.") => {
        return response.status(404).json({ success: false, message: info });
    };

    export const AlreadyExists = (response: Response, info: string = "Item already exists.") => {
        return response.status(409).json({ success: false, message: info });
    };

    export const InternalServerError = (response: Response, info: string = "Internal Server error.") => {
        return response.status(500).json({ success: false, message: info });
    };
}
