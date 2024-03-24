import { AdminRole } from "../entities/Admin";
import { UserDto } from "./UserDto";

export namespace AdminDto {
    export interface CreateAdminDto {
        username: string;
        password: string;
        role: AdminRole;
        identifier: string;
    }

    export interface CreateAdminWithUserDto extends UserDto.CreateUserDto {
        username: string;
        password: string;
        role: AdminRole;
    }
}
