import { AdminRole } from "../entities/Admin";

export interface CreateTeacherDto {
    code: string;
    password: string;
    kotebName?: AdminRole;
    bonus?: string;
    type?: string;
    identifier: string;
}
export interface UpdateTeacherDto {
    id: string;
    code?: string;
    password?: string;
    kotebName?: AdminRole;
    bonus?: string;
    type?: string;
    identifier?: string;
}
