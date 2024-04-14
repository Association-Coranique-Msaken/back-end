import { NextFunction, type Request, type Response } from "express";
import { AdminValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";
import { AuthService } from "../services/authService";

// User Login
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, birthDate } = req.body;
    try {
        if (!identifier || !birthDate) {
            return Responses.BadRequest(res, "Identifier and password are required.");
        }
        const { user, accessToken, refreshToken } = await AuthService.userLogin(identifier, birthDate);
        return Responses.LoginSuccess(res, user, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return Responses.BadRequest(res, "Username and password are required");
        }
        const { admin, accessToken, refreshToken } = await AuthService.adminLogin(username, password);
        return Responses.LoginSuccess(res, admin, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

// Teacher Login
const teacherLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { code, password } = req.body;
    if (!code || !password) {
        return Responses.BadRequest(res, "Code and password are required.");
    }
    try {
        const { teacher, accessToken, refreshToken } = await AuthService.teacherLogin(code, password);
        return Responses.LoginSuccess(res, teacher, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

// Admin signup - only for testing.
const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = AdminValidator.creationWithUser.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const admin = await AdminService.createAdminWithUser(req.body);
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
        const { entity, accessToken, refreshToken } = await AuthService.refreshToken(refresh_token);
        return Responses.RefreshTokenSuccess(res, entity, accessToken, refreshToken);
    } catch (error) {
        next(error);
    }
};

export default { adminLogin, adminSignup, userLogin, teacherLogin, logout, refreshToken };
