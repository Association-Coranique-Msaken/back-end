import ms from "ms";
import dotenv from "dotenv";

dotenv.config();

export const ACCESS_TOKEN_EXP = ms(process.env.JWT_EXP_IN!);
export const REFRESH_TOKEN_EXP = ms(process.env.JWT_REFRESH_EXP_IN!);
export const RESET_TOKEN_EXP = ms(process.env.JWT_RESET_PSWD_EXP_IN!);
