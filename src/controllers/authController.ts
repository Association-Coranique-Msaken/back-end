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
        const refreshToken = encrypt.generateRefreshToken({ id: user.id });

        return res.status(200).json({
            success: true,
            message: "User Login successful",
            data: user,
            accessToken: token,
            refreshToken: refreshToken,
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
        const admin = await adminRepository.findOne({ where: { username: username } });

        if (!admin) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = encrypt.comparepassword(admin!.password, password);

        if (!admin || !isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: admin.id });
        const refreshToken = encrypt.generateRefreshToken({ id: admin.id });

        return res.status(200).json({
            success: true,
            message: "Admin Login successful",
            data: admin,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (errors) {
        console.error(errors);
        return res.status(500).json({ success: false, message: "Internal server error", errors });
    }
};

//Teacher Login
const teacherLogin = async (req: Request, res: Response) => {
    const { code, password } = req.body;
    try {
        if (!code || !password) {
            return res.status(400).json({ message: "identifier and password are required" });
        }
        const teacher = await teacherRepository.findOne({ where: { code: code } });

        const isPasswordValid = teacher?.password == password;
        if (!teacher || !isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = encrypt.generateToken({ id: teacher.id });
        // Generate refresh token
        const refreshToken = encrypt.generateRefreshToken({ id: teacher.id });

        return res.status(200).json({
            success: true,
            message: "Teacher Login successful",
            data: teacher,
            accessToken: token,
            refreshToken: refreshToken,
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
            return res.status(409).json({ success: false, message: "Username already exists" });
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

const signout = async (req: Request, res: Response) => {
    try {
        // Clear the refresh token from the client-side storage
        // For example, if you're using local storage
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("token");

        // Or if you're using session storage
        // sessionStorage.removeItem("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Signout Successfully",
        });
    } catch (error) {
        console.error("Error during signout:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Refresh Access Token
//TDOD: implement refresh token
export default { adminLogin, adminSignup, userLogin, teacherLogin, signout };
