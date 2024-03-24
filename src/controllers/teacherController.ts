import { NextFunction, type Request, type Response } from "express";
import { TeacherValidator } from "../validators/TeacherValidator";
import { Responses } from "../helpers/Responses";
import { TeacherService } from "../services/teacherService";

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
        const teachers = await TeacherService.getTeachers();
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

export const deleteTeacher = async (req: Request, res: Response, next: NextFunction) => {
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
