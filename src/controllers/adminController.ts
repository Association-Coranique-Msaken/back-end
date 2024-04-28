import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";
import { UserService } from "../services/userService";
import { TeacherService } from "../services/teacherService";
import { GroupService } from "../services/GroupService";
import { generateDtoMetaData, mapToDto } from "../DTOs/dtoEngine";
import { Admin } from "../entities/Admin";
import { Teacher } from "../entities/Teacher";
import { User } from "../entities/User";
import { Group } from "../entities/Group";
import { GroupUser } from "../entities/GroupUser";

const createAdminDtoMeta = generateDtoMetaData("CreateAdminDto", Admin.prototype);
const updateAdminDtoMeta = generateDtoMetaData("UpdateAdminDto", Admin.prototype);
const createTeacherDtoMeta = generateDtoMetaData("CreateTeacherDto", Teacher.prototype);
const updateTeacherDtoMeta = generateDtoMetaData("UopdateTeacherDto", Teacher.prototype);
const createUserDtoMeta = generateDtoMetaData("CreateUserDto", User.prototype);
const updateUserDtoMeta = generateDtoMetaData("UpdateUserDto", User.prototype);
const createGroupDtoMeta = generateDtoMetaData("CreateGroupDto", Group.prototype);
const updateGroupDtoMeta = generateDtoMetaData("UpdateGroupDto", Group.prototype);
const enrollUserToGroupMeta = generateDtoMetaData("EnrollUserToGroupDto", GroupUser.prototype);

export const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedAdmins = await AdminService.getAdmins(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedAdmins);
    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createAdmindto = mapToDto(createAdminDtoMeta, req.body);
        const admin = await AdminService.createAdmin(createAdmindto);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateAdmindto = mapToDto(updateAdminDtoMeta, req.body);
        await AdminService.updateAdminById({ ...updateAdmindto, id: req.params.id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        const teacher = await AdminService.getAdminById(req.params.id);
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const deleteAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        await AdminService.deleteAdminById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

// teacher functionality
export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createTeacherdto = mapToDto(createTeacherDtoMeta, req.body);
        const teacher = await TeacherService.createTeacher(createTeacherdto);
        return Responses.CreateSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedTeachers = await TeacherService.getTeachers(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedTeachers);
    } catch (error) {
        next(error);
    }
};

export const getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        const teacher = await TeacherService.getTeacherById(req.params.id);
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateTeacherdto = mapToDto(updateTeacherDtoMeta, req.body);
        await TeacherService.updateTeacherById({ ...updateTeacherdto, id: req.params.id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        await TeacherService.deleteTeacherById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getTeacherByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.code) {
            return Responses.BadRequest(res);
        }
        const teacher = await TeacherService.getTeacherByCode(req.params.code);
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createUserdto = mapToDto(createUserDtoMeta, req.body);
        const user = await UserService.createUser(createUserdto);
        return Responses.CreateSucess(res, user);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedUsers = await UserService.getUsers(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedUsers);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const user = await UserService.getUserById(req.params.id);
        return Responses.FetchSucess(res, user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateUserdto = mapToDto(updateUserDtoMeta, req.body);
        await UserService.updateUserById({ ...updateUserdto, id: req.params.id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        await UserService.deleteUser(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

// groups

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createGroupdto = mapToDto(createGroupDtoMeta, req.body);
        const admin = await GroupService.createGroup(createGroupdto);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedGroups = await GroupService.getGroups(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedGroups);
    } catch (error) {
        next(error);
    }
};

export const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const group = await GroupService.getGroupById(req.params.id);
        return Responses.FetchSucess(res, group);
    } catch (error) {
        next(error);
    }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateGroupdto = mapToDto(updateGroupDtoMeta, req.body);
        await GroupService.updateGroupById({ ...updateGroupdto, id: req.params.id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        await GroupService.deleteGroupById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

// TODO: this should be implemented as filter for getGroups (filter-by: teacherId)
const getTeacherGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.teacherId !== "string") {
        return Responses.BadRequest(res, "teacherId is required.");
    }
    try {
        const entities = await GroupService.getTeacherGroups(req.query.teacherId, res.locals.paging);
        return Responses.FetchSucess(res, entities);
    } catch (error) {
        next(error);
    }
};

export const getGroupUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const users = await GroupService.getGroupUsers(req.params.id, res.locals.paging);
        return Responses.FetchSucess(res, users);
    } catch (error) {
        next(error);
    }
};

export const enrollUserToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, groupId } = mapToDto(enrollUserToGroupMeta, req.body);
        await GroupService.enrollUserToGroup(userId, groupId);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
