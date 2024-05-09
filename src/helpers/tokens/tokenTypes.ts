import { type Admin } from "../../entities/Admin";
import { type Teacher } from "../../entities/Teacher";
import { type User } from "../../entities/User";
import { encrypt } from "../encrypt";
import * as jwt from "jsonwebtoken";

export const TOKEN_TYPE_USER = "User";
export const TOKEN_TYPE_TEACHER = "Teacher";
export const TOKEN_TYPE_ADMIN = "Admin";

export type TokenType = "User" | "Teacher" | "Admin";

export interface EntityToken {
    tokenType: TokenType;
    expiration: Date;
    id: string;
}

export interface WithAccessToken {
    accessToken: string;
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
        this.userId = admin.user.id;
    }

    tokenType: TokenType;
    expiration: Date;
    id: string;
    role: string;
    userId: string;
}

export class TeacherToken implements EntityToken {
    public constructor(teacher: Teacher) {
        this.tokenType = "Teacher";
        this.id = teacher.id;
        this.isActive = teacher.isActive;
        this.userId = teacher.user.id;
    }

    tokenType: TokenType;
    expiration: Date;
    id: string;
    isActive: boolean;
    userId: string;
}

export class UserRefreshToken extends UserToken implements WithAccessToken {
    public constructor(user: User, accessToken: string) {
        super(user);
        this.accessToken = accessToken;
    }
    accessToken: string;
}

export class AdminRefreshToken extends AdminToken implements WithAccessToken {
    public constructor(admin: Admin, accessToken: string) {
        super(admin);
        this.accessToken = accessToken;
    }
    accessToken: string;
}

export class TeacherRefreshToken extends TeacherToken implements WithAccessToken {
    public constructor(teacher: Teacher, accessToken: string) {
        super(teacher);
        this.accessToken = accessToken;
    }
    accessToken: string;
}

export namespace Tokens {
    export const GenerateUserToken = (user: User) => encrypt.generateToken(new UserToken(user));
    export const GenerateAdminToken = (admin: Admin) => encrypt.generateToken(new AdminToken(admin));
    export const GenerateTeacherToken = (teacher: Teacher) => encrypt.generateToken(new TeacherToken(teacher));

    export const GenerateUserRefreshToken = (user: User, accessToken: string) =>
        encrypt.generateRefreshToken(new UserRefreshToken(user, accessToken));
    export const GenerateAdminRefreshToken = (admin: Admin, accessToken: string) =>
        encrypt.generateRefreshToken(new AdminRefreshToken(admin, accessToken));
    export const GenerateTeacherRefreshToken = (teacher: Teacher, accessToken: string) =>
        encrypt.generateRefreshToken(new TeacherRefreshToken(teacher, accessToken));

    export const DecodeAccessTokenAs = <T extends EntityToken>(typeName: string, token?: string) =>
        DecodeAs<T>(process.env.JWT_TOKEN_SECRET!, typeName, token);
    export const DecodeRefreshTokenAs = <T extends EntityToken>(typeName: string, token?: string) =>
        DecodeAs<T>(process.env.JWT_REFRESH_TOKEN_SECRET!, typeName, token);

    export const verifyAccessToken = (token?: string) => verifyToken(process.env.JWT_TOKEN_SECRET!, token);
    export const verifyRefreshToken = (token?: string) => verifyToken(process.env.JWT_REFRESH_TOKEN_SECRET!, token);

    const verifyToken = (key: jwt.Secret, token?: string) => {
        if (!token) {
            throw new jwt.JsonWebTokenError("Invalid token.");
        }
        const decode = jwt.verify(token, key) as jwt.JwtPayload;
        if (!decode?.value?.tokenType || !decode.value.id) {
            throw new jwt.JsonWebTokenError("Invalid token.");
        }
        if (decode.exp) {
            decode.value.expiration = new Date(decode.exp * 1000);
        }
        return decode.value;
    };

    const DecodeAs = <T extends EntityToken>(key: jwt.Secret, typeName: string, token?: string) => {
        const decode = verifyToken(key, token);
        if (decode.tokenType !== typeName) {
            throw new jwt.JsonWebTokenError("Not a user token.");
        }
        return decode as T;
    };
}
