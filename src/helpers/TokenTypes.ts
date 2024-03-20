import { type Admin } from "../entities/Admin";
import { type Teacher } from "../entities/Teacher";
import { type User } from "../entities/User";
import { encrypt } from "./helpers";
import * as jwt from "jsonwebtoken";

export type TokenType = "User" | "Teacher" | "Admin";

export interface EntityToken {
    tokenType: TokenType;
    expiration: Date;
    id: string;
}

export class UserToken implements EntityToken {
    public constructor(user: User) {
        this.tokenType = "User";
        this.id = user.id;
    }

    tokenType: TokenType;
    expiration: Date;
    id: string;
}

export class AdminToken implements EntityToken {
    public constructor(admin: Admin) {
        this.tokenType = "Admin";
        this.id = admin.id;
        this.role = admin.role;
    }

    tokenType: TokenType;
    expiration: Date;
    id: string;
    role: string;
}

export class TeacherToken implements EntityToken {
    public constructor(teacher: Teacher) {
        this.tokenType = "Teacher";
        this.id = teacher.id;
        this.isActive = teacher.isActive;
    }

    tokenType: TokenType;
    expiration: Date;
    id: string;
    isActive: boolean;
}

export namespace Tokens {
    export const GenerateUserToken = (user: User) => encrypt.generateToken(new UserToken(user));
    export const GenerateAdminToken = (admin: Admin) => encrypt.generateToken(new AdminToken(admin));
    export const GenerateTeacherToken = (teacher: Teacher) => encrypt.generateToken(new TeacherToken(teacher));

    export const GenerateUserRefreshToken = (user: User) => encrypt.generateRefreshToken(new UserToken(user));
    export const GenerateAdminRefreshToken = (admin: Admin) => encrypt.generateRefreshToken(new AdminToken(admin));
    export const GenerateTeacherRefreshToken = (teacher: Teacher) =>
        encrypt.generateRefreshToken(new TeacherToken(teacher));

    export const verifyToken = (token?: string) => {
        if (!token) {
            throw new jwt.JsonWebTokenError("Invalid token.");
        }
        const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as jwt.JwtPayload;
        if (!decode?.value?.tokenType || !decode.value.id) {
            throw new jwt.JsonWebTokenError("Invalid token.");
        }
        if (decode.exp) {
            decode.value.expiration = new Date(decode.exp);
        }
        return decode.value;
    };

    export const DecodeAs = <T extends EntityToken>(typeName: string, token?: string) => {
        const decode = verifyToken(token);
        if (decode.tokenType !== typeName) {
            throw new jwt.JsonWebTokenError("Not a user token.");
        }
        return decode as T;
    };

    export const DecodeUserToken = (token?: string) => {
        const decode = verifyToken(token);
        if (decode.tokenType !== "User") {
            throw new jwt.JsonWebTokenError("Not a user token.");
        }
        return decode as UserToken;
    };

    export const DecodeAdminToken = (token?: string) => {
        const decode = verifyToken(token);
        if (decode.tokenType !== "Admin") {
            throw new jwt.JsonWebTokenError("Not an admin token.");
        }
        return decode as AdminToken;
    };

    export const DecodeTeacherToken = (token?: string) => {
        const decode = verifyToken(token);
        if (decode.tokenType !== "Teacher") {
            throw new jwt.JsonWebTokenError("Not a teacher token.");
        }
        return decode as TeacherToken;
    };
}
