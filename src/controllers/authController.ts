import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { encrypt, formatDate } from "../helpers/helpers";
import { adminCreationValidator } from "../validators/AdminValidator";
import { User } from "../entities/User";
import { Teacher } from "../entities/Teacher";
import { Responses } from "../helpers/Responses";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

//User Login
const userLogin = async (req: Request, res: Response) => {
    const { identifier, birthDate } = req.body;
    try {
        if (!identifier || !birthDate) {
            return Responses.BadRequest(res, "Identifier and password are required.");
        }
        const user = await userRepository.findOne({ where: { identifier: identifier } });
        if (!user) {
            return Responses.BadCredentials(res);
        }

        const isPasswordValid = formatDate(user.birthDate) === birthDate;
        if (!isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const accessToken = encrypt.generateToken({ id: user.id });
        const refreshToken = encrypt.generateRefreshToken({ id: user.id });
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
        const admin = await adminRepository.findOne({ where: { username: username } });

        if (!admin) {
            return Responses.BadCredentials(res);
        }

        const isPasswordValid = encrypt.comparepassword(admin!.password, password);
        if (!isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: admin.id });
        const refreshToken = encrypt.generateRefreshToken({ id: admin.id });
        return Responses.LoginSuccess(res, admin, token, refreshToken);
    } catch (errors) {
        console.error(errors);
        return Responses.InternalServerError(res);
    }
};

//Teacher Login
const teacherLogin = async (req: Request, res: Response) => {
    const { code, password } = req.body;
    try {
        if (!code || !password) {
            return Responses.BadRequest(res, "Code and password are required.");
        }
        const teacher = await teacherRepository.findOne({ where: { code: code } });
        const isPasswordValid = teacher?.password == password;

        if (!teacher || !isPasswordValid) {
            return Responses.BadCredentials(res);
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: teacher.id });
        // Generate refresh token
        const refreshToken = encrypt.generateRefreshToken({ id: teacher.id });
        return Responses.LoginSuccess(res, teacher, token, refreshToken);
    } catch (errors) {
        console.error(errors);
        return Responses.InternalServerError(res);
    }
};

//Admin signup
const adminSignup = async (req: Request, res: Response) => {
    const { error } = adminCreationValidator.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const { username, firstName, lastName, password, role } = req.body;
        let admin = await adminRepository.findOne({ where: { username: username } });

        if (admin) {
            return Responses.AlreadyExists(res);
        }

        const encryptedPassword = await encrypt.encryptpass(password);
        const newAdmin = new Admin();

        newAdmin.username = username;
        newAdmin.firstName = firstName;
        newAdmin.lastName = lastName;
        newAdmin.password = encryptedPassword;
        newAdmin.role = role;

        await adminRepository.save(newAdmin);
        return Responses.CreateSucess(res, newAdmin);
    } catch (error) {
        console.error("Error during signup:", error);
        return Responses.InternalServerError(res);
    }
};

const signout = async (req: Request, res: Response) => {
    try {
        // Clear the refresh token from the client-side storage
        // For example, if you're using local storage
        localStorage.removeItem("refreshToken"); //TODO: fix this
        localStorage.removeItem("token");
        // Or if you're using session storage
        // sessionStorage.removeItem("refreshToken");

        return Responses.SignoutSucess(res);
    } catch (error) {
        console.error("Error during signout:", error);
        return Responses.InternalServerError(res);
    }
};

// Refresh Access Token
//TDOD: implement refresh token
export default { adminLogin, adminSignup, userLogin, teacherLogin, signout };
