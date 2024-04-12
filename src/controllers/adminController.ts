import { NextFunction, type Request, type Response } from "express";
import { AdminValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";
import { TeacherValidator } from "../validators/TeacherValidator";
import { UserValidator } from "../validators/UserValidator";
import { UserService } from "../services/userService";
import { TeacherService } from "../services/teacherService";
import { GroupService } from "../services/GroupService";
import { FormativeYearGroupValidator, SummerGroupValidator } from "../validators/GroupValidator";
import Joi from "joi";

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
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    const { error } = AdminValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await AdminService.updateAdminById({ ...req.body, id: req.params.id });
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
    const { error } = TeacherValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await TeacherService.updateTeacherById({ ...req.body, id: req.params.id });
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
    const { error } = UserValidator.update.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        await UserService.updateUserById({ ...req.body, id: req.params.id });
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
    let err: Joi.ValidationError | undefined;
    if (req.body.courseType === "summerGroup") {
        const { error } = SummerGroupValidator.creation.validate(req.body);
        err = error;
    } else {
        const { error } = FormativeYearGroupValidator.creation.validate(req.body);
        err = error;
    }
    if (err) {
        return Responses.ValidationBadRequest(res, err);
    }
    try {
        const admin = await GroupService.createGroup(req.body);
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
    if (!req.params.id) {
        return Responses.BadRequest(res, "id is required.");
    }
    let err: Joi.ValidationError | undefined;
    if (req.body.courseType === "summerGroup") {
        const { error, value } = SummerGroupValidator.update.validate(req.body);
        err = error;
        req.body = value;
    } else {
        const { error } = FormativeYearGroupValidator.update.validate(req.body);
        err = error;
    }
    if (err) {
        return Responses.ValidationBadRequest(res, err);
    }
    try {
        await GroupService.updateGroupById({ ...req.body, id: req.params.id });
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

// TODO: this should be implemented as filter for getGroups
export const getTeacherGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.query.teacherId !== "string") {
        return Responses.BadRequest(res, "teacherId is required in the query params.");
    }
    try {
        await GroupService.getTeacherGroups(req.query.teacherId, res.locals.paging);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
