import { TokenResultDto } from "../DTOs/TokenResultDto";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { invalidTokensCache } from "../helpers/InvalidTokensCache";
import { EntityToken, TOKEN_TYPE_ADMIN, TOKEN_TYPE_TEACHER, TOKEN_TYPE_USER, Tokens } from "../helpers/TokenTypes";
import { AppErrors } from "../helpers/appErrors";
import { encrypt, CompareDates, getEstimatedTokensExp } from "../helpers/helpers";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

export class AuthService {
    public static userLogin = async (identifier: string, birthDate: Date) => {
        const user = await userRepository.findOne({ where: { identifier } });
        if (!user) {
            throw new AppErrors.BadCredentials();
        }
        const isPasswordValid = CompareDates(user.birthDate, birthDate);
        if (!isPasswordValid) {
            throw new AppErrors.BadCredentials();
        }

        // Generate JWT token
        const accessToken = Tokens.GenerateUserToken(user);
        const refreshToken = Tokens.GenerateUserRefreshToken(user);
        return {
            user: user,
            tokenResult: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                ...getEstimatedTokensExp(),
            } as TokenResultDto,
        };
    };

    public static adminLogin = async (username: string, password: string) => {
        const admin = await adminRepository.findOne({
            where: { username },
            relations: ["user"],
        });
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
            tokenResult: {
                accessToken: token,
                refreshToken: refreshToken,
                ...getEstimatedTokensExp(),
            } as TokenResultDto,
        };
    };

    public static teacherLogin = async (code: string, password: string) => {
        const teacher = await teacherRepository.findOne({ where: { code }, relations: ["user"] });
        const isPasswordValid = teacher?.password === password;

        if (!teacher || !isPasswordValid) {
            throw new AppErrors.BadCredentials();
        }

        // Generate JWT token
        const token = Tokens.GenerateTeacherToken(teacher);
        const refreshToken = Tokens.GenerateTeacherRefreshToken(teacher);

        return {
            teacher: teacher,
            tokenResult: {
                accessToken: token,
                refreshToken: refreshToken,
                ...getEstimatedTokensExp(),
            } as TokenResultDto,
        };
    };

    public static logout = async (userToken: string, decodedToken: EntityToken) => {
        await invalidTokensCache.invalidate(userToken, decodedToken.id, decodedToken.expiration);
    };

    public static refreshToken = async (refreshToken: string) => {
        const decodedToken = Tokens.verifyRefreshToken(refreshToken);
        await invalidTokensCache.checkValidity(refreshToken, decodedToken.id, decodedToken.expiration);
        invalidTokensCache.invalidate(refreshToken, decodedToken.id, decodedToken.expiration);

        switch (decodedToken.tokenType) {
            case TOKEN_TYPE_USER:
                const user = await userRepository.findOne({ where: { id: decodedToken.id } });
                if (!user) {
                    throw new AppErrors.NotFound("No user corresponding to token.");
                }
                return {
                    entity: user,
                    tokenResult: {
                        accessToken: Tokens.GenerateUserToken(user),
                        refreshToken: Tokens.GenerateUserRefreshToken(user),
                        ...getEstimatedTokensExp(),
                    } as TokenResultDto,
                };
            case TOKEN_TYPE_TEACHER:
                const teacher = await teacherRepository.findOne({
                    where: { id: decodedToken.id },
                    relations: ["user"],
                });
                if (!teacher) {
                    throw new AppErrors.NotFound("No user corresponding to token.");
                }
                return {
                    entity: teacher,
                    tokenResult: {
                        accessToken: Tokens.GenerateTeacherToken(teacher),
                        refreshToken: Tokens.GenerateTeacherRefreshToken(teacher),
                        ...getEstimatedTokensExp(),
                    } as TokenResultDto,
                };
            case TOKEN_TYPE_ADMIN:
                const admin = await adminRepository.findOne({ where: { id: decodedToken.id }, relations: ["user"] });
                if (!admin) {
                    throw new AppErrors.NotFound("No user corresponding to token.");
                }
                return {
                    entity: admin,
                    tokenResult: {
                        accessToken: Tokens.GenerateAdminToken(admin),
                        refreshToken: Tokens.GenerateAdminRefreshToken(admin),
                        ...getEstimatedTokensExp(),
                    } as TokenResultDto,
                };
        }
        throw new AppErrors.NotFound("No user corresponding to token.");
    };
}
