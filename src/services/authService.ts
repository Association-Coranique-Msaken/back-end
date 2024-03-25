import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { invalidTokensCache } from "../helpers/InvalidTokensCache";
import { EntityToken, Tokens } from "../helpers/TokenTypes";
import { AppErrors } from "../helpers/appErrors";
import { encrypt, formatDate } from "../helpers/helpers";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

export class AuthService {
    public static userLogin = async (identifier: string, birthDate: string) => {
        try {
            const user = await userRepository.findOne({ where: { identifier } });
            if (!user) {
                throw new AppErrors.BadCredentials();
            }
            const isPasswordValid = formatDate(user.birthDate) === birthDate;
            if (!isPasswordValid) {
                throw new AppErrors.BadCredentials();
            }

            // Generate JWT token
            const accessToken = Tokens.GenerateUserToken(user);
            const refreshToken = Tokens.GenerateUserRefreshToken(user);
            return {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
        } catch (error) {
            throw new AppErrors.InternalError();
        }
    };

    public static adminLogin = async (username: string, password: string) => {
        try {
            const admin = await adminRepository.findOne({ where: { username } });
            if (!admin) {
                throw new AppErrors.BadCredentials();
            }
            const isPasswordValid = encrypt.comparepassword(admin.password, password);
            if (!isPasswordValid) {
                throw new AppErrors.BadCredentials();
            }
            // Generate JWT token
            const token = Tokens.GenerateAdminToken(admin);
            const refreshToken = Tokens.GenerateAdminRefreshToken(admin);
            return {
                admin: admin,
                accessToken: token,
                refreshToken: refreshToken,
            };
        } catch (errors) {
            throw new AppErrors.InternalError();
        }
    };

    public static teacherLogin = async (code: string, password: string) => {
        try {
            const teacher = await teacherRepository.findOne({ where: { code } });
            const isPasswordValid = teacher?.password === password;

            if (!teacher || !isPasswordValid) {
                throw new AppErrors.BadCredentials();
            }

            // Generate JWT token
            const token = Tokens.GenerateTeacherToken(teacher);
            const refreshToken = Tokens.GenerateTeacherRefreshToken(teacher);

            return {
                teacher: teacher,
                accessToken: token,
                refreshToken: refreshToken,
            };
        } catch (errors) {
            throw new AppErrors.InternalError();
        }
    };

    public static logout = async (userToken: string, decodedToken: EntityToken) => {
        try {
            await invalidTokensCache.invalidate(userToken, decodedToken.id, decodedToken.expiration);
        } catch (error) {
            console.error(error);
            throw new AppErrors.InternalError();
        }
    };
}
