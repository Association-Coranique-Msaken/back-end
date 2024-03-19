import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Admin } from "../entities/Admin";
import * as dotenv from "dotenv";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { Teacher } from "../entities/Teacher";
import { Responses } from "../helpers/Responses";
dotenv.config();
// Since they are 3 diffrent tables in the database so we do not need to check the role of the user
// we can just check it for the admin coz he has diffrent roles
export const adminAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return Responses.Unauthorized(res);
    }

    const token = header.split(" ")[1];
    if (!token) {
        return Responses.Unauthorized(res);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;

        if (!decode || !decode.id) {
            return Responses.Unauthorized(res);
        }
        const adminRepository = appDataSource.getRepository(Admin);
        const admin = await adminRepository.findOne({ where: { id: decode.id } });

        if (!admin) {
            return Responses.Unauthorized(res);
        }
        next();
    } catch (error: any) {
        return Responses.BadRequest(res);
    }
};

export const userAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return Responses.Unauthorized(res);
    }

    const token = header.split(" ")[1];
    if (!token) {
        return Responses.Unauthorized(res);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decode || !decode.id) {
            return Responses.Unauthorized(res);
        }

        const userRepository = appDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decode.id } });

        if (!user) {
            return Responses.Unauthorized(res);
        }

        next();
    } catch (error: any) {
        return Responses.BadRequest(res);
    }
};

export const teacherAuthentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return Responses.Unauthorized(res);
    }

    const token = header.split(" ")[1];
    if (!token) {
        return Responses.Unauthorized(res);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decode || !decode.id) {
            return Responses.Unauthorized(res);
        }

        const teacherRepository = appDataSource.getRepository(Teacher);
        const teacher = await teacherRepository.findOne({ where: { id: decode.id } });

        if (!teacher) {
            return Responses.Unauthorized(res);
        }

        next();
    } catch (error: any) {
        return Responses.Unauthorized(res);
    }
};
