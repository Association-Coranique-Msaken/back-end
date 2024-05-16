import { TokenResultDto } from "../DTOs/tokenResultDto";
import { appDataSource } from "../config/database";
import { Admin } from "../entities/admin";
import { Teacher } from "../entities/teacher";
import { User } from "../entities/user";
import { AccessTokenRepo, RefreshTokenRepo } from "../helpers/tokens/tokensRepository";
import {
    EntityToken,
    TOKEN_TYPE_ADMIN,
    TOKEN_TYPE_TEACHER,
    TOKEN_TYPE_USER,
    Tokens,
} from "../helpers/tokens/tokenTypes";
import { AppErrors } from "../helpers/appErrors";
import { encrypt } from "../helpers/encrypt";
import { CompareDates } from "../helpers/helpers";
import { getEstimatedRefreshTokenExp, getEstimatedTokensExp } from "../helpers/tokens/tokensHelpers";

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
        const refreshToken = Tokens.GenerateUserRefreshToken(user, accessToken);
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
        const refreshToken = Tokens.GenerateAdminRefreshToken(admin, token);
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
        const refreshToken = Tokens.GenerateTeacherRefreshToken(teacher, token);

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
        await AccessTokenRepo.blacklist(decodedToken.id, userToken, decodedToken.expiration);
        // this means the corresponding refresh token will be no longer valid.
        await RefreshTokenRepo.blacklist(decodedToken.id, userToken, getEstimatedRefreshTokenExp());
    };

    public static refreshToken = async (refreshToken: string) => {
        const decodedToken = Tokens.verifyRefreshToken(refreshToken);
        const correspondingAccessToken = decodedToken.accessToken ?? "";
        await RefreshTokenRepo.checkValidity(refreshToken, decodedToken.id, decodedToken.expiration);
        RefreshTokenRepo.blacklist(decodedToken.id, refreshToken, decodedToken.expiration);
        // if the access token got unvalidated in a way requiring refresh token to be invalid too.
        await RefreshTokenRepo.checkValidity(correspondingAccessToken, decodedToken.id, decodedToken.expiration);

        switch (decodedToken.tokenType) {
            case TOKEN_TYPE_USER:
                const user = await userRepository.findOne({ where: { id: decodedToken.id } });
                if (!user) {
                    throw new AppErrors.NotFound("No user corresponding to token.");
                }
                const userAccessToken = Tokens.GenerateUserToken(user);
                return {
                    entity: user,
                    tokenResult: {
                        accessToken: userAccessToken,
                        refreshToken: Tokens.GenerateUserRefreshToken(user, userAccessToken),
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
                const teacherAccessToken = Tokens.GenerateTeacherToken(teacher);
                return {
                    entity: teacher,
                    tokenResult: {
                        accessToken: teacherAccessToken,
                        refreshToken: Tokens.GenerateTeacherRefreshToken(teacher, teacherAccessToken),
                        ...getEstimatedTokensExp(),
                    } as TokenResultDto,
                };
            case TOKEN_TYPE_ADMIN:
                const admin = await adminRepository.findOne({ where: { id: decodedToken.id }, relations: ["user"] });
                if (!admin) {
                    throw new AppErrors.NotFound("No user corresponding to token.");
                }
                const adminAccessToken = Tokens.GenerateAdminToken(admin);
                return {
                    entity: admin,
                    tokenResult: {
                        accessToken: adminAccessToken,
                        refreshToken: Tokens.GenerateAdminRefreshToken(admin, adminAccessToken),
                        ...getEstimatedTokensExp(),
                    } as TokenResultDto,
                };
        }
        throw new AppErrors.NotFound("No user corresponding to token.");
    };
}
