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

    static generateToken(id: any) {
        if (!process.env.TOKEN_SECRET_KEY) throw new Error("TOKEN_SECRET is undefined");
        return jwt.sign(id, process.env.TOKEN_SECRET_KEY, { expiresIn: "1d" });
    }

    static generateRefreshToken(id: any) {
        if (!process.env.REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is undefined");
        return jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    }
}

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
