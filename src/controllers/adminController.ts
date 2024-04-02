import { NextFunction, type Request, type Response } from "express";
import { AdminValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";
import { TeacherValidator } from "../validators/TeacherValidator";
import { UserValidator } from "../validators/UserValidator";
import { UserService } from "../services/userService";
import { TeacherService } from "../services/teacherService";
import { SummerGroupService } from "../services/summerGroupService";
import { SummerGroupValidator } from "../validators/SummerGroupValidator";
import { FormativeYearGroupService } from "../services/FormativeYearGroupService";
import { FormativeYearGroupValidator } from "../validators/FormativeYearGroupValidator";

export const getAdmins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedAdmins = await AdminService.getAdmins(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedAdmins);
    } catch (error) {
        next(error);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = AdminValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const admin = await AdminService.createAdmin(req.body);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = AdminValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await AdminService.updateAdminById(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const getAdminById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res);
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
            return Responses.BadRequest(res);
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
        const { error } = TeacherValidator.creation.validate(req.body);
        if (error) {
            return Responses.ValidationBadRequest(res, error);
        }
        const teacher = await TeacherService.createTeacher(req.body);
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
            return Responses.BadRequest(res);
        }
        const teacher = await TeacherService.getTeacherById(req.params.id);
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = TeacherValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await TeacherService.updateTeacherById(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res);
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
    const { error } = UserValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const user = await UserService.createUser(req.body);
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
        return Responses.BadRequest(res);
    }
    try {
        const user = await UserService.getUserById(req.params.id);
        return Responses.FetchSucess(res, user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = UserValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await UserService.updateUser(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        await UserService.deleteUser(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

// groups

export const createSummerGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = SummerGroupValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const admin = await SummerGroupService.createGroup(req.body);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const getSummerGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedGroups = await SummerGroupService.getGroups(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedGroups);
    } catch (error) {
        next(error);
    }
};

export const getSummerGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        const group = await SummerGroupService.getGroupById(req.params.id);
        return Responses.FetchSucess(res, group);
    } catch (error) {
        next(error);
    }
};

export const updateSummerGroupById = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = SummerGroupValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await SummerGroupService.updateGroupById(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteSummerGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        await SummerGroupService.deleteGroupById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getTeacherSummerGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.teacherId) {
        return Responses.BadRequest(res);
    }
    try {
        await SummerGroupService.getTeacherGroups(req.params.teacherId, res.locals.paging);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

// formative year groups

export const createFormativeYearGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = FormativeYearGroupValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const admin = await FormativeYearGroupService.createGroup(req.body);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        next(error);
    }
};

export const getFormativeYearGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagedGroups = await FormativeYearGroupService.getGroups(res.locals.paging);
        return Responses.FetchPagedSucess(res, pagedGroups);
    } catch (error) {
        next(error);
    }
};

export const getFormativeYearGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        const group = await FormativeYearGroupService.getGroupById(req.params.id);
        return Responses.FetchSucess(res, group);
    } catch (error) {
        next(error);
    }
};

export const updateFormativeYearGroupById = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = FormativeYearGroupValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await FormativeYearGroupService.updateGroupById(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteFormativeYearGroupById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        await FormativeYearGroupService.deleteGroupById(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};

export const getTeacherFormativeYearGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.teacherId) {
        return Responses.BadRequest(res);
    }
    try {
        await FormativeYearGroupService.getTeacherGroups(req.params.teacherId, res.locals.paging);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
