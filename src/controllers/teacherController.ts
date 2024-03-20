import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { teacherCreationValidator, teacherUpdateValidator } from "../validators/TeacherValidator";
import { User } from "../entities/User";
import { Responses } from "../helpers/Responses";

const teacherRepository = appDataSource.getRepository(Teacher);
const userRepository = appDataSource.getRepository(User);

export const insertTeacher = async (
    code: string,
    password: string,
    kottebName: string,
    bonus: string,
    type: string,
    user: User
): Promise<Teacher> => {
    const teacher = new Teacher();
    teacher.code = code;
    teacher.password = password; // TODO: hash password or auto generate
    teacher.kotebName = kottebName;
    teacher.bonus = bonus;
    teacher.teacherType = type;
    teacher.teacherType = type;
    teacher.user = user;
    await teacherRepository.save(teacher);
    return teacher;
};

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const { error } = teacherCreationValidator.validate(req.body);
        if (error) {
            return Responses.ValidationBadRequest(res, error);
        }

        const userId = req.body?.identifier;
        const user = await userRepository.findOne({ where: { identifier: userId } });
        if (user) {
            const { code, password, kotebName, bonus, type } = req.body;
            const teacher = await insertTeacher(code, password, kotebName, bonus, type, user);
            return Responses.CreateSucess(res, teacher);
        } else {
            return Responses.NotFound(res, `Unable to find corresponding user with identifier: ${userId}`);
        }
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await teacherRepository.find({ where: { isDeleted: false } });
        return Responses.FetchSucess(res, teachers);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacher = await teacherRepository.findOne({
            where: { id: teacherId, isDeleted: false },
            relations: ["user"],
        });

        if (!teacher) {
            return Responses.NotFound(res);
        }

        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const updateTeacher = async (req: Request, res: Response) => {
    const { error } = teacherUpdateValidator.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const teacherId = req.params.id;
        const updatedFields = req.body; // Get updated fields from request body

        const teacher = await teacherRepository.findOne({
            where: { id: teacherId, isDeleted: false },
        });

        if (!teacher) {
            return Responses.NotFound(res);
        }

        // Update teacher fields
        await teacherRepository.update(teacherId, updatedFields);
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacher = await teacherRepository.findOne({ where: { id: teacherId } });

        if (!teacher) {
            return Responses.NotFound(res);
        }

        if (teacher.isDeleted) {
            return Responses.BadRequest(res);
        }
        await teacherRepository.update(teacherId, { isDeleted: true });
        return Responses.DeleteSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const getTeacherByCode = async (req: Request, res: Response) => {
    try {
        const teacherCode = req.params.code;
        const teacher = await teacherRepository.findOne({ where: { code: teacherCode, isDeleted: false } });

        if (!teacher) {
            return Responses.NotFound(res);
        }
        return Responses.FetchSucess(res, teacher);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};
