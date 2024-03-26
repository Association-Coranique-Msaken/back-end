import { NextFunction, type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { AdminValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";
import { TeacherValidator } from "../validators/TeacherValidator";
import { UserValidator } from "../validators/UserValidator";

const adminRepository = appDataSource.getRepository(Admin);

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await adminRepository.find();
        return Responses.FetchSucess(res, admins);
    } catch (error) {
        return Responses.InternalServerError(res);
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

// teacher functionality
export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { error } = TeacherValidator.creation.validate(req.body);
        if (error) {
            return Responses.ValidationBadRequest(res, error);
        }
        const teacher = await AdminService.createTeacher(req.body);
        return Responses.CreateSucess(res, teacher);
    } catch (error) {
        next(error);
    }
};

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers = await AdminService.getTeachers();
        return Responses.FetchSucess(res, teachers);
    } catch (error) {
        next(error);
    }
};

export const getTeacherById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res);
        }
        const teacher = await AdminService.getTeacherById(req.params.id);
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
        await AdminService.updateTeacherById(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return Responses.BadRequest(res);
        }
        await AdminService.deleteTeacherById(req.params.id);
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
        const teacher = await AdminService.getTeacherByCode(req.params.code);
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
        const user = await AdminService.createUser(req.body);
        return Responses.CreateSucess(res, user);
    } catch (error) {
        next(error);
    }
};

// TODO Add pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await AdminService.getUsers();
        return Responses.FetchSucess(res, users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        const user = await AdminService.getUserById(req.params.id);
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
        await AdminService.updateUser(req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) {
        return Responses.BadRequest(res);
    }
    try {
        await AdminService.deleteUser(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};
