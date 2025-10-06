import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export class encrypt {
    static async encryptPass(password: string) {
        return bcrypt.hashSync(password, 12);
    }

    static comparePassword = (hashPassword: string, password: string) => bcrypt.compareSync(password, hashPassword);

    static generateToken(object: any): string {
        if (!process.env.JWT_TOKEN_SECRET) throw new Error("JWT_TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_EXP_IN });
    }

    static generateRefreshToken(object: any): string {
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("JWT_REFRESH_TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXP_IN,
        });
    }

    static generateResetPasswordLinkData(object: any): string {
        if (!process.env.JWT_RESET_PSWD_SECRET) throw new Error("JWT_RESET_PSWD_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_RESET_PSWD_SECRET, {
            expiresIn: process.env.JWT_RESET_PSWD_EXP_IN,
        });
    }
}
