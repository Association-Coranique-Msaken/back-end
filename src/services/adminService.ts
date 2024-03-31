import { DeepPartial } from "typeorm";
import { CreateAdminDto, CreateAdminWithUserDto } from "../DTOs/AdminDto";
import { UpdateUserDto } from "../DTOs/UserDto";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { encrypt } from "../helpers/helpers";
import { Teacher } from "../entities/Teacher";
import { CreateTeacherDto, UpdateTeacherDto } from "../DTOs/TeacherDto";
import { PageOptionsDto } from "../DTOs/PageOptionsDto";
import { PageMetaDto } from "../DTOs/PageMetaDto";
import { PageDto } from "../DTOs/PageDto";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);
const teacherRepository = appDataSource.getRepository(Teacher);

export class AdminService {
    public static getAdmins = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Admin>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(Admin, "admin")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto);
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static createAdmin = async (adminData: CreateAdminDto): Promise<Admin> => {
        // Check if admin exists.
        if (await adminRepository.findOne({ where: { username: adminData.username } })) {
            throw new AppErrors.AlreadyExists("username aleady exists");
        }
        const user = await userRepository.findOne({ where: { identifier: adminData.identifier } });
        if (user) {
            if (await AdminService.getAdminWithUserId(user.id)) {
                throw new AppErrors.AlreadyExists("Admin with the same user identifier already exists.");
            }
            const encryptedPassword = await encrypt.encryptpass(adminData.password);
            const newAdmin = new Admin();
            newAdmin.username = adminData.username;
            newAdmin.password = encryptedPassword;
            newAdmin.role = adminData.role;
            newAdmin.user = user;
            const createdAdmin = await adminRepository.save(newAdmin);
            return createdAdmin;
        } else {
            throw new AppErrors.NotFound(`Unable to find corresponding user with identifier: ${adminData.identifier}`);
        }
    };

    private static async getAdminWithUserId(userId: string): Promise<Admin | null> {
        return await appDataSource
            .createQueryBuilder()
            .select()
            .from(Admin, "admin")
            .where(`userId = '${userId}'`)
            .getOne();
    }

    public static createAdminWithUser = async (adminUserData: CreateAdminWithUserDto): Promise<Admin> => {
        const user = await AdminService.createUser(adminUserData);
        const adminData: CreateAdminDto = {
            username: adminUserData.username,
            password: adminUserData.password,
            role: adminUserData.role,
            identifier: user.identifier,
        };
        return await AdminService.createAdmin(adminData);
    };

    public static createTeacher = async (teacherData: CreateTeacherDto): Promise<Teacher> => {
        const userId = teacherData.identifier;
        const user = await userRepository.findOne({ where: { identifier: userId } });
        if (user) {
            return teacherRepository.create({ ...teacherData, user: user });
        } else {
            throw new AppErrors.NotFound(
                `Unable to find corresponding user with identifier: ${teacherData.identifier}`
            );
        }
    };

    public static getTeachers = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<Teacher>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(Teacher, "teacher")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto);
        const [itemCount, entities] = await Promise.all([query.getCount(), query.execute()]);
        return new PageDto(entities, new PageMetaDto({ itemCount, pageOptionsDto }));
    };

    public static getTeacherById = async (id: string): Promise<Teacher> => {
        const teacher = await teacherRepository.findOne({
            where: { id: id, isDeleted: false },
            relations: ["user"],
        });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        return teacher;
    };

    public static updateTeacherById = async (updateData: UpdateTeacherDto) => {
        const teacher = await teacherRepository.findOne({
            where: { code: updateData.code, isDeleted: false },
        });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        // Update teacher fields
        await teacherRepository.update(teacher.id, updateData);
    };

    public static deleteTeacherById = async (id: string) => {
        const teacher = await teacherRepository.findOne({ where: { id: id } });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        if (teacher.isDeleted) {
            throw new AppErrors.AlreadyDeleted();
        }
        await teacherRepository.update(id, { isDeleted: true });
    };

    public static getTeacherByCode = async (code: string): Promise<Teacher> => {
        const teacher = await teacherRepository.findOne({ where: { code: code, isDeleted: false } });
        if (!teacher) {
            throw new AppErrors.NotFound();
        }
        return teacher;
    };

    public static createUser = async (user: any): Promise<User> => {
        // TODO: Add lock here to prevent race condition in case of parallel requests.
        const identifier = await AdminService.getNewUserIdentifier();
        const data: DeepPartial<User> = { ...user, identifier };
        const newUser = await userRepository.create(data);
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
        return AdminService.computeNextIdentifier(currentYear, perviousIdentifier);
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

    public static getUsers = async (pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> => {
        const query = appDataSource
            .createQueryBuilder()
            .select()
            .from(User, "user")
            .where({ isDeleted: false })
            .addPaging(pageOptionsDto);
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

    public static updateUser = async (updateData: UpdateUserDto) => {
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
    };
}
