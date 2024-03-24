import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { encrypt, formatDate } from "../helpers/helpers";
import { AdminValidator } from "../validators/AdminValidator";
import { User } from "../entities/User";
import { Teacher } from "../entities/Teacher";
import { Responses } from "../helpers/Responses";
import { Tokens } from "../helpers/TokenTypes";
import { invalidTokensCache } from "../helpers/InvalidTokensCache";
import { AdminService } from "../services/adminService";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

// User Login
const userLogin = async (req: Request, res: Response) => {
    const { identifier, birthDate } = req.body;
    try {
        if (!identifier || !birthDate) {
            return Responses.BadRequest(res, "Identifier and password are required.");
        }
        const user = await userRepository.findOne({ where: { identifier } });
        if (!user) {
            return Responses.BadCredentials(res);
        }

        const isPasswordValid = formatDate(user.birthDate) === birthDate;
        if (!isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const accessToken = Tokens.GenerateUserToken(user);
        const refreshToken = Tokens.GenerateUserRefreshToken(user);
        return Responses.LoginSuccess(res, user, accessToken, refreshToken);
    } catch (errors) {
        console.error(errors);
        return Responses.InternalServerError(res);
    }
};

const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return Responses.BadRequest(res, "Username and password are required");
        }
        const admin = await adminRepository.findOne({ where: { username } });

        if (!admin) {
            return Responses.BadCredentials(res);
        }

        const isPasswordValid = encrypt.comparepassword(admin.password, password);
        if (!isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const token = Tokens.GenerateAdminToken(admin);
        const refreshToken = Tokens.GenerateAdminRefreshToken(admin);
        return Responses.LoginSuccess(res, admin, token, refreshToken);
    } catch (errors) {
        console.error(errors);
        return Responses.InternalServerError(res);
    }
};

// Teacher Login
const teacherLogin = async (req: Request, res: Response) => {
    const { code, password } = req.body;
    try {
        if (!code || !password) {
            return Responses.BadRequest(res, "Code and password are required.");
        }
        const teacher = await teacherRepository.findOne({ where: { code } });
        const isPasswordValid = teacher?.password === password;

        if (!teacher || !isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const token = Tokens.GenerateTeacherToken(teacher);
        // Generate refresh token
        const refreshToken = Tokens.GenerateTeacherRefreshToken(teacher);
        return Responses.LoginSuccess(res, teacher, token, refreshToken);
    } catch (errors) {
        console.error(errors);
        return Responses.InternalServerError(res);
    }
};

// Admin signup - only for testing.
const adminSignup = async (req: Request, res: Response) => {
    const { error } = AdminValidator.creationWithUser.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        return await AdminService.createAdminWithUser(req.body);
    } catch (error) {
        console.error("Error during signup:", error);
        return Responses.InternalServerError(res);
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        const decodedToken = res.locals.decodedToken;
        const header = req.headers.authorization;
        const rawToken = header!.split(" ")[1];
        await invalidTokensCache.invalidate(rawToken, decodedToken.id, decodedToken.expiration);
        return Responses.LogoutSucess(res);
    } catch (error) {
        console.error(error);
        return Responses.InternalServerError(res);
    }
};

// Refresh Access Token
// TODO: implement refresh token
export default { adminLogin, adminSignup, userLogin, teacherLogin, logout };
