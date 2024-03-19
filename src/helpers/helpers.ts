import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

export class encrypt {
    static async encryptpass(password: string) {
        return bcrypt.hashSync(password, 12);
    }

    static comparepassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(object: any) {
        if (!process.env.JWT_TOKEN_SECRET) throw new Error("TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_EXP_IN });
    }

    static generateRefreshToken(object: any) {
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXP_IN,
        });
    }
}

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
