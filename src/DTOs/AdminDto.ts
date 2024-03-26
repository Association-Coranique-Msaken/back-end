import { AdminRole } from "../entities/Admin";
import { CreateUserDto } from "./UserDto";

export interface CreateAdminDto {
    username: string;
    password: string;
    role: AdminRole;
    identifier: string;
}
export interface CreateAdminWithUserDto extends CreateUserDto {
    username: string;
    password: string;
    role: AdminRole;
}
