import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { encrypt, formatDate } from "../helpers/helpers";
import { adminCreationValidator } from "../validators/AdminValidator";
import { User } from "../entities/User";
import { Teacher } from "../entities/Teacher";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

//User Login
const userLogin = async (req: Request, res: Response) => {
    const { identifier, birthDate } = req.body;
    try {
        if (!identifier || !birthDate) {
            return res.status(400).json({ message: "identifier and password are required" });
        }
        const user = await userRepository.findOne({ where: { identifier: identifier } });
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = formatDate(user.birthDate) === birthDate;
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: user.id });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
            accessToken: token,
        });
    } catch (errors) {
        console.error(errors);
        return res.status(500).json({ success: false, message: "Internal server error", errors });
    }
};

const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        const user = await adminRepository.findOne({ where: { username: username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = encrypt.comparepassword(user!.password, password);

        if (!user || !isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: user.id });
        // Generate refresh token
        // const refreshToken = encrypt.generateRefreshToken(user.id);

        // // Send refresh token to client as an HTTP-only cookie
        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true,
        //     maxAge: 60 * 4000,

        //     path: "/api/auth/admin/refresh",
        // });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user,
            accessToken: token,
            // refreshToken: refreshToken,
        });
    } catch (errors) {
        console.error(errors);
        return res.status(500).json({ success: false, message: "Internal server error", errors });
    }
};

//Admin signup
const adminSignup = async (req: Request, res: Response) => {
    const { error } = adminCreationValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    try {
        const { username, firstName, lastName, password, role } = req.body;
        let admin = await adminRepository.findOne({ where: { username: username } });

        if (admin) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const encryptedPassword = await encrypt.encryptpass(password);
        const newAdmin = new Admin();

        newAdmin.username = username;
        newAdmin.firstName = firstName;
        newAdmin.lastName = lastName;
        newAdmin.password = encryptedPassword;
        newAdmin.role = role;

        await adminRepository.save(newAdmin);

        return res.status(201).json({ success: true, message: "Admin created successfully", data: newAdmin });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// export const signout = async (req: Request, res: Response) => {
//     res.clearCookie("refreshtoken", {
//         httpOnly: true,
//         sameSite: "none",
//         secure: true,
//         path: "/api/auth/admin/refresh",
//     });
//     res.status(200).json({
//         success: true,
//         message: "Signout Successfully",
//     });
//     res.end();
// };

export default { adminLogin, adminSignup, userLogin };
