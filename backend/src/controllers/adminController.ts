import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/responses";
import { AdminService } from "../services/adminService";
import { UserService } from "../services/userService";
import { TeacherService } from "../services/teacherService";
import { GroupService } from "../services/groupService";
import { mapToDto } from "../DTOs/dtoEngine";
import { DtoMeta } from "../DTOs/dtoMeta";
import { CardService } from "../services/cardService";
import { CompetitionService } from "../services/competitionService";
import { CompetitionRegistrationService } from "../services/competitionRegistrationService";

export const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedAdmins = await AdminService.getAdmins(res.locals.paging, res.locals.filter);
        return Responses.FetchPagedSuccess(res, pagedAdmins);
    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createAdminDto = mapToDto(DtoMeta.createAdmin.meta, req.body);
        const admin = await AdminService.createAdmin(createAdminDto);
        return Responses.CreateSuccess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateAdminDto = mapToDto(DtoMeta.updateAdmin.meta, req.body);
        await AdminService.updateAdminById({ ...updateAdminDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
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
        return Responses.FetchSuccess(res, teacher);
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
        const createTeacherDto = mapToDto(DtoMeta.createTeacher.meta, req.body);
        const teacher = await TeacherService.createTeacher(createTeacherDto);
        return Responses.CreateSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedTeachers = await TeacherService.getTeachers(res.locals.paging, res.locals.filter);
        return Responses.FetchPagedSuccess(res, pagedTeachers);
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
        return Responses.FetchSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateTeacherDto = mapToDto(DtoMeta.updateTeacher.meta, req.body);
        await TeacherService.updateTeacherById({ ...updateTeacherDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
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
        return Responses.FetchSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const regenerateTeacherPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.teacherId) {
            return Responses.BadRequest(res);
        }
        const teacher = await TeacherService.regenerateTeacherPassword(req.params.teacherId);
        return Responses.UpdateSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createUserDto = mapToDto(DtoMeta.createUser.meta, req.body);
        const user = await UserService.createUser(createUserDto);
        return Responses.CreateSuccess(res, user);
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedUsers = await UserService.getUsers(res.locals.paging, res.locals.filter);
        return Responses.FetchPagedSuccess(res, pagedUsers);
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
        return Responses.FetchSuccess(res, user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateUserDto = mapToDto(DtoMeta.updateUser.meta, req.body);
        await UserService.updateUserById({ ...updateUserDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
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
        const createGroupDto = mapToDto(DtoMeta.createGroup.meta, req.body);
        const admin = await GroupService.createGroup(createGroupDto);
        return Responses.CreateSuccess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedGroups = await GroupService.getGroups(res.locals.paging, res.locals.filter);
        return Responses.FetchPagedSuccess(res, pagedGroups);
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
        return Responses.FetchSuccess(res, group);
    } catch (error) {
        next(error);
    }
};

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateGroupDto = mapToDto(DtoMeta.updateGroup.meta, req.body);
        await GroupService.updateGroupById({ ...updateGroupDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
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
        return Responses.FetchSuccess(res, entities);
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
        return Responses.FetchSuccess(res, users);
    } catch (error) {
        next(error);
    }
};

export const enrollUserToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, groupId } = mapToDto(DtoMeta.enrollUserToGroup.meta, req.body);
        await GroupService.enrollUserToGroup(userId, groupId);
        return Responses.UpdateSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const generateAdminResetPasswordLink = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateLink = await AdminService.generateAdminResetPasswordLink(req.params.id);
        return Responses.OperationSuccess(res, updateLink);
    } catch (error) {
        next(error);
    }
};

export const createCardForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createUserCardDto = mapToDto(DtoMeta.createCard.meta, req.body);
        const result = await CardService.createUserCard({ ...createUserCardDto, id: req.params.id });
        return Responses.CreateSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

export const getUserLastCard = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.userId) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const card = await CardService.getUserLastCard(req.params.userId);
        return Responses.FetchSuccess(res, card);
    } catch (error) {
        next(error);
    }
};

export const getCompetitions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedCompetitions = await CompetitionService.getCompetitions(res.locals.paging, res.locals.filter);
        return Responses.FetchPagedSuccess(res, pagedCompetitions);
    } catch (error) {
        next(error);
    }
};

export const createCompetition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createCompetitionDto = mapToDto(DtoMeta.createCompetition.meta, req.body);
        const admin = await CompetitionService.createCompetition(createCompetitionDto);
        return Responses.CreateSuccess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const updateCompetition = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateCompetitionDto = mapToDto(DtoMeta.updateCompetition.meta, req.body);
        await CompetitionService.updateCompetitionById({ ...updateCompetitionDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getCompetitionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        const teacher = await CompetitionService.getCompetitionById(req.params.id);
        return Responses.FetchSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const deleteCompetitionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        await CompetitionService.deleteCompetitionById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getCompetitionRegistrations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedCompetitions = await CompetitionRegistrationService.getRegistrations(
            res.locals.paging,
            res.locals.filter
        );
        return Responses.FetchPagedSuccess(res, pagedCompetitions);
    } catch (error) {
        next(error);
    }
};

export const createCompetitionRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createCompetitionDto = mapToDto(DtoMeta.createCompetitionRegistration.meta, req.body);
        const admin = await CompetitionRegistrationService.createRegistration(createCompetitionDto);
        return Responses.CreateSuccess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const updateCompetitionRegistrationById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    try {
        const updateCompetitionDto = mapToDto(DtoMeta.updateCompetitionRegistration.meta, req.body);
        await CompetitionRegistrationService.updateRegistration({ ...updateCompetitionDto, id: req.params.id });
        return Responses.UpdateSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getCompetitionRegistrationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        const teacher = await CompetitionRegistrationService.getRegistrationById(req.params.id);
        return Responses.FetchSuccess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const deleteCompetitionRegistrationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res, "id is required.");
        }
        await CompetitionRegistrationService.deleteRegistrationById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};
