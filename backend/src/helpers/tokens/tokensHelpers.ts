import * as dotenv from "dotenv";
import ms from "ms";
import * as jwt from "jsonwebtoken";
import { ResetPswdTokenRepo } from "./tokensRepository";

dotenv.config();

export const getEstimatedUserTokenExp = () => new Date(Date.now() + ms(process.env.JWT_EXP_IN!));
export const getEstimatedRefreshTokenExp = () => new Date(Date.now() + ms(process.env.JWT_REFRESH_EXP_IN!));

export const getEstimatedTokensExp = () => {
    return {
        userTokenExpiration: getEstimatedUserTokenExp(),
        refreshTokenExpiration: getEstimatedRefreshTokenExp(),
    };
};

export const decodeAndCheckResetPasswordToken = async (token: string): Promise<{ id: string; expiration: Date }> => {
    if (!process.env.JWT_RESET_PSWD_SECRET) throw new Error("JWT_RESET_PSWD_SECRET is undefined");
    const decode = jwt.verify(token, process.env.JWT_RESET_PSWD_SECRET) as jwt.JwtPayload;
    const id = decode.value;
    if (!id || !decode.exp) {
        throw new jwt.JsonWebTokenError("Invalid or expired reset password token.");
    }
    const expiration = new Date(decode.exp * 1000);
    await ResetPswdTokenRepo.checkValidity(token, id, expiration);
    return { id, expiration };
};
