import { Request, Response, NextFunction } from "express";
import { appDataSource } from "../config/Database";
import * as jwt from "jsonwebtoken";
import { Admin } from "../entities/Admin";

export const adminAuthorization = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header!.split(" ")[1];

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
        const adminRole = admin!.role;
        if (role !== adminRole) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error: any) {
        return res.status(403).json({ message: "Forbidden", error: error.message });
    }
};
