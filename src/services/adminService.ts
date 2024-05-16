import { appDataSource } from "../config/database";
import { Admin } from "../entities/admin";
import { User } from "../entities/user";
import { AppErrors } from "../helpers/appErrors";
import { generateResetPasswordLink } from "../helpers/helpers";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PageMetaDto } from "../DTOs/paging/pageMetaDto";
import { PageDto } from "../DTOs/paging/pageDto";
import { UserService } from "./userService";
import { SelectQueryBuilder } from "typeorm";
import { Group } from "../entities/group";
import { FilterQuery } from "../filters/types";
import "../filters/extensions";
import { encrypt } from "../helpers/encrypt";
import { AccessTokenRepo, RefreshTokenRepo, ResetPswdTokenRepo } from "../helpers/tokens/tokensRepository";
import { transformQueryOutput } from "../helpers/queryHelpers";
import { decodeAndCheckResetPasswordToken } from "../helpers/tokens/tokensHelpers";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const groupRepository = appDataSource.getRepository(Group);

export class AdminService {
    public static getAdmins = async (
        pageOptionsDto: PageOptionsDto,
        filters: FilterQuery
    ): Promise<PageDto<Partial<Admin>>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select(["admin"])
            .from(Admin, "admin")
            .where({ isDeleted: false })
            .leftJoinAndSelect("admin.user", "user")
            .addPaging(pageOptionsDto, "admin")
            .addFilters(filters);

        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        const [admins, users] = await transformQueryOutput(entities, ["admin_", "user_"]);
        for (let i = 0; i < admins.length; i++) {
            admins[i].user = users[i];
        }
        return new PageDto(admins, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static createAdmin = async (adminData: any): Promise<Admin> => {
        // FIXME should we check also for deleted ?
        if (await adminRepository.findOne({ where: { username: adminData.username } })) {
            throw new AppErrors.AlreadyExists(`username '${adminData.username}' aleady exists`);
        }

        let user: User | null =
            adminData.user ?? (await userRepository.findOne({ where: { id: adminData.userId, isDeleted: false } }));
        if (user) {
            if (await AdminService.adminWithUserIdExists(user.id)) {
                throw new AppErrors.AlreadyExists(
                    `Admin with the user identifier '${adminData.identifier}' already exists.`
                );
            }
            const encryptedPassword = await encrypt.encryptpass(adminData.password!);
            const newAdmin = new Admin();
            newAdmin.username = adminData.username!;
            newAdmin.password = encryptedPassword!;
            newAdmin.role = adminData.role!;
            newAdmin.user = user;
            const createdAdmin = await adminRepository.save(newAdmin);
            return createdAdmin;
        } else {
            throw new AppErrors.NotFound(`Unable to find corresponding user with identifier: ${adminData.identifier}`);
        }
    };

    public static updateAdminById = async (updateData: any) => {
        const admin = await AdminService.getAdminOrThrow(updateData.id);
        Promise.all([
            AdminService.unvalidateAccessTokenIfNeeded(updateData, admin),
            await adminRepository.update(admin.id, updateData),
        ]);
    };

    private static fetchAdminWithUserIdQuery = (userId: string): SelectQueryBuilder<Admin> =>
        appDataSource.createQueryBuilder().select().from(Admin, "admin").where(`userId = '${userId}'`);

    private static adminWithUserIdExists = async (userId: string): Promise<boolean> =>
        (await AdminService.fetchAdminWithUserIdQuery(userId).getCount()) > 0;

    private static getAdminWithUserId = async (userId: string): Promise<Admin | null> =>
        await AdminService.fetchAdminWithUserIdQuery(userId).getOne();

    public static createAdminWithUser = async (adminUserData: any): Promise<Admin> => {
        adminUserData.user = await UserService.createUser(adminUserData);
        return await AdminService.createAdmin(adminUserData);
    };

    public static getAdminById = async (id: string): Promise<Admin> => {
        const admin = await adminRepository.findOne({
            where: { id: id, isDeleted: false },
            relations: ["user"],
        });
        if (!admin) {
            throw new AppErrors.NotFound();
        }
        return admin;
    };

    public static deleteAdminById = async (id: string) => {
        const admin = await adminRepository.findOne({ where: { id: id } });
        if (!admin) {
            throw new AppErrors.NotFound();
        }
        if (admin.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        await adminRepository.update(id, { isDeleted: true });
    };

    public static generateAdminResetPasswordLink = async (adminId: string) => {
        const admin = await AdminService.getAdminOrThrow(adminId);
        return generateResetPasswordLink(adminId);
    };

    public static resetAdminPassword = async (token: string, newPassword: string) => {
        const { id, expiration } = await decodeAndCheckResetPasswordToken(token);
        const admin = await AdminService.getAdminOrThrow(id);
        admin.password = await encrypt.encryptpass(newPassword);
        const res = await adminRepository.update(admin.id, admin);
        if (!res.affected) {
            throw new AppErrors.InternalError();
        }
        await AccessTokenRepo.blacklistAll(admin.id);
        await RefreshTokenRepo.blacklistAll(admin.id);
        await ResetPswdTokenRepo.blacklist(admin.id, token, expiration);
        return admin;
    };

    private static getAdminOrThrow = async (adminId: string): Promise<Admin> => {
        const admin = await adminRepository.findOne({ where: { id: adminId, isDeleted: false } });
        if (!admin) {
            throw new AppErrors.NotFound(`Unable to find admin with id : '${adminId}'.`);
        }
        return admin;
    };

    private static unvalidateAccessTokenIfNeeded = async (updateData: any, currentData: Admin): Promise<void> => {
        if (AdminService.shouldUnvalidateAccessToken(updateData, currentData)) {
            return await AccessTokenRepo.blacklistAll(currentData.id);
        }
    };

    private static shouldUnvalidateAccessToken = (updateData: any, currentData: Admin): boolean => {
        if (updateData.role != undefined) {
            return updateData.role != currentData.role;
        }
        return true;
    };
}
