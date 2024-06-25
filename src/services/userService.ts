import { DeepPartial } from "typeorm";
import { appDataSource } from "../config/database";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PageDto } from "../DTOs/paging/pageDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { FilterQuery } from "../filters/types";
import { AccessTokenRepo, RefreshTokenRepo, ResetPswdTokenRepo } from "../helpers/tokens/tokensRepository";
import { Teacher } from "../entities/teacher";
import { Admin } from "../entities/admin";
import { AdminService } from "./adminService";
import { TeacherService } from "./teacherService";
import { getOrThrow } from "../helpers/queryHelpers";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

export class UserService {
    public static createUser = async (user: any): Promise<User> => {
        // TODO: Add lock here to prevent race condition in case of parallel requests.
        const identifier = await UserService.getNewUserIdentifier();
        const data: DeepPartial<User> = { ...user, identifier };
        const newUser = userRepository.create(data);
        await userRepository.save(newUser);
        return newUser;
    };

    public static getNewUserIdentifier = async () => {
        const queryResult = await appDataSource
            .createQueryBuilder()
            .select("MAX(`identifier`)", "id")
            .from(User, "user")
            .execute();
        const perviousIdentifier = queryResult?.[0]?.id;
        const currentYear = new Date().getFullYear();
        return UserService.computeNextIdentifier(currentYear, perviousIdentifier);
    };

    public static computeNextIdentifier = (currentYear: number, perviousIdentifier?: string): string => {
        if (perviousIdentifier) {
            const previousIdentifierYear = parseInt(perviousIdentifier.substring(0, 4));
            if (currentYear > previousIdentifierYear) {
                return `${currentYear}001`;
            } else {
                const previousIncrementalOrder = parseInt(perviousIdentifier.substring(4, 8)) ?? 1;
                const nextIncrementalOrder = previousIncrementalOrder + 1;
                if (nextIncrementalOrder >= 1000) {
                    return `${previousIdentifierYear + 1}000`;
                } else {
                    return `${previousIdentifierYear}${nextIncrementalOrder.toString().padStart(3, "0")}`;
                }
            }
        } else {
            return `${currentYear}001`;
        }
    };

    public static getUsers = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<User>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(User, "user")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto, "user")
            .addFilters(filters);

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getUserById = async (id: string): Promise<User> => {
        const user = await userRepository.findOne({ where: { id: id, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound();
        }
        return user;
    };

    public static updateUserById = async (updateData: any) => {
        const user = await userRepository.findOne({ where: { id: updateData.id, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound();
        }
        await userRepository.update(updateData.id, updateData);
    };

    public static deleteUser = async (id: string) => {
        const user = await userRepository.findOne({ where: { id: id } });
        if (!user) {
            return new AppErrors.NotFound();
        }
        if (user.isDeleted) {
            return new AppErrors.AlreadyDeleted();
        }
        await userRepository.update(id, { isDeleted: true });

        const admin = await adminRepository.findOne({ where: { user: { id: id } } });
        if (admin) {
            await AdminService.deleteAdminById(admin.id);
            AccessTokenRepo.blacklistAll(admin.id);
            RefreshTokenRepo.blacklistAll(admin.id);
            ResetPswdTokenRepo.blacklistAll(admin.id);
        }

        const teacher = await teacherRepository.findOne({ where: { user: { id: id } } });
        if (teacher) {
            await TeacherService.deleteTeacherById(teacher.id);
            AccessTokenRepo.blacklistAll(teacher.id);
            RefreshTokenRepo.blacklistAll(teacher.id);
            ResetPswdTokenRepo.blacklistAll(teacher.id);
        }

        AccessTokenRepo.blacklistAll(id);
        RefreshTokenRepo.blacklistAll(id);
        ResetPswdTokenRepo.blacklistAll(id);
    };

    public static getUserOrThrow = async (id: string, bringDeleted: boolean = false) =>
        getOrThrow<User>(id, userRepository, "user", bringDeleted);
}
