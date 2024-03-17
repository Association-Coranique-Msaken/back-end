import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Admin } from "../entities/Admin";
import * as dotenv from "dotenv";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { Teacher } from "../entities/Teacher";
dotenv.config();
// Since they are 3 diffrent tables in the database so we do not need to check the role of the user
// we can just check it for the admin coz he has diffrent roles
export const adminAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;

        if (!decode || !decode.id) {
            throw new Error("Invalid token!");
        }
        const adminRepository = appDataSource.getRepository(Admin);
        const admin = await adminRepository.findOne({ where: { id: decode.id } });

        if (!admin) {
            throw new Error("Admin not found");
        }

        next();
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
};

export const userAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decode || !decode.id) {
            throw new Error("Invalid token!");
        }

        const userRepository = appDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decode.id } });

        if (!user) {
            throw new Error("user not found or invalid token!");
        }

        next();
    } catch (error: any) {
        return res.status(401).json({ message: "Invalid token!" + error.message });
    }
};

export const teacherAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decode || !decode.id) {
            throw new Error("Invalid token!");
        }

        const teacherRepository = appDataSource.getRepository(Teacher);
        const teacher = await teacherRepository.findOne({ where: { id: decode.id } });

        if (!teacher) {
            throw new Error("Teacher not found or invalid token!");
        }

        next();
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};
