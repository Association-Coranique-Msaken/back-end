import { AdminDto } from "../DTOs/AdminDto";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { User } from "../entities/User";
import { AppErrors } from "../helpers/appErrors";
import { encrypt } from "../helpers/helpers";
import { UserService } from "./userService";

const userRepository = appDataSource.getRepository(User);
const adminRepository = appDataSource.getRepository(Admin);

export class AdminService {
    public static createAdmin = async (adminData: AdminDto.CreateAdminDto): Promise<Admin> => {
        try {
            // Check if admin exists.
            if (await adminRepository.findOne({ where: { username: adminData.username } })) {
                throw new AppErrors.AlreadyExists();
            }
            const user = await userRepository.findOne({ where: { identifier: adminData.identifier } });
            if (user) {
                const encryptedPassword = await encrypt.encryptpass(adminData.password);
                const newAdmin = new Admin();
                newAdmin.username = adminData.username;
                newAdmin.password = encryptedPassword;
                newAdmin.role = adminData.role;
                newAdmin.user = user;
                await adminRepository.save(newAdmin);
                return newAdmin;
            } else {
                throw new AppErrors.NotFound(
                    `Unable to find corresponding user with identifier: ${adminData.identifier}`
                );
            }
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };

    public static createAdminWithUser = async (adminUserData: AdminDto.CreateAdminWithUserDto): Promise<Admin> => {
        try {
            const user = await UserService.createUser(adminUserData);
            const adminData: AdminDto.CreateAdminDto = {
                username: adminUserData.username,
                password: adminUserData.password,
                role: adminUserData.role,
                identifier: user.identifier,
            };
            return await AdminService.createAdmin(adminData);
        } catch (error) {
            throw new AppErrors.InternalError(error);
        }
    };
}
