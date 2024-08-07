import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/responses";
import { AdminService } from "../services/adminService";
import { AuthService } from "../services/authService";
import { mapToDto } from "../DTOs/dtoEngine";
import { DtoMeta } from "../DTOs/dtoMeta";

// User Login
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier, birthDate } = mapToDto(DtoMeta.userLogin.meta, req.body);
        const { user, tokenResult } = await AuthService.userLogin(identifier, birthDate);
        return Responses.LoginSuccess(res, user, tokenResult);
    } catch (error) {
        next(error);
    }
};

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = mapToDto(DtoMeta.adminLogin.meta, req.body);
        const { admin, tokenResult } = await AuthService.adminLogin(username, password);
        return Responses.LoginSuccess(res, admin, tokenResult);
    } catch (error) {
        next(error);
    }
};

// Teacher Login
const teacherLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, password } = mapToDto(DtoMeta.teacherLogin.meta, req.body);
        const { teacher, tokenResult } = await AuthService.teacherLogin(code, password);
        return Responses.LoginSuccess(res, teacher, tokenResult);
    } catch (error) {
        next(error);
    }
};

// Admin signup - only for testing.
const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createAdmindto = mapToDto(DtoMeta.createUserAdmin.meta, req.body);
        const admin = await AdminService.createAdminWithUser(createAdmindto);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

// FIXME: we need to invalidate refresh token as well?
const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = res.locals.decodedToken;
        const header = req.headers.authorization;
        const rawToken = header!.split(" ")[1];
        await AuthService.logout(rawToken, decodedToken);
        return Responses.LogoutSucess(res);
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = (req.body["refresh_token"] as string) || "";
    if (!refresh_token) {
        return Responses.Unauthorized(res, "Invalid refresh token.");
    }
    try {
        const { entity, tokenResult } = await AuthService.refreshToken(refresh_token);
        return Responses.RefreshTokenSuccess(res, entity, tokenResult);
    } catch (error) {
        next(error);
    }
};

const resetAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.token) {
        return Responses.BadRequest(res, "Invalid reset password token.");
    }
    if (!req.body.newPassword) {
        return Responses.BadRequest(res, "newPassword is required in body.");
    }
    try {
        const updatedAdmin = await AdminService.resetAdminPassword(req.query.token as string, req.body.newPassword);
        const { admin, tokenResult } = await AuthService.adminLogin(updatedAdmin.username, req.body.newPassword);
        return Responses.LoginSuccess(res, admin, tokenResult);
    } catch (error) {
        next(error);
    }
};

export default { adminLogin, adminSignup, userLogin, teacherLogin, logout, refreshToken, resetAdminPassword };
