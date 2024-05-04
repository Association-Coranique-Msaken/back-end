import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { encrypt, transformQueryOutput } from "../helpers/helpers";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { PageMetaDto } from "../DTOs/paging/PageMetaDto";
import { PageDto } from "../DTOs/paging/PageDto";
import { UserService } from "./userService";
import { SelectQueryBuilder } from "typeorm";
import { Group } from "../entities/Group";
import { FilterQuery } from "../filters/types";
import "../filters/extensions";

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
        // Check if admin exists.
        if (await adminRepository.findOne({ where: { username: adminData.username } })) {
            throw new AppErrors.AlreadyExists(`username '${adminData.username}' aleady exists`);
        }

        var user: User | null = adminData.user ?? (await userRepository.findOne({ where: { id: adminData.userId } }));
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
        const admin = await adminRepository.findOne({
            where: { id: updateData.id, isDeleted: false },
        });
        if (!admin) {
            throw new AppErrors.NotFound(`Unable to find admin with id: ${updateData.id}`);
        }
        await adminRepository.update(admin.id, updateData);
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

    public static enrollUserToSummerGroup = async (userId: string, grouId: string) => {
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });
        if (!user) {
            throw new AppErrors.NotFound(`Unable to find user with id : '${userId}'.`);
        }
        const group = await groupRepository.findOne({ where: { id: grouId, isDeleted: false } });
        if (!group) {
            throw new AppErrors.NotFound(`Unable to find group with id : '${userId}'.`);
        }
    };
}
