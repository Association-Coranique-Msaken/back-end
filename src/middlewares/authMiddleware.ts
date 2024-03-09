import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Admin } from "../entities/Admin";
import * as dotenv from "dotenv";
import { appDataSource } from "../config/Database";
dotenv.config();
export const authentification = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY!);
    if (!decode) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    (req as any).currentUser = decode;
    next();
};

export const authorization = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userRepo = appDataSource.getRepository(Admin);
        const admin = await userRepo.findOne({
            //where: { id: req["currentUser"].id },
            where: { id: (req as any).currentUser.id },
        });
        console.log(admin);
        if (!roles.includes(admin!.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
