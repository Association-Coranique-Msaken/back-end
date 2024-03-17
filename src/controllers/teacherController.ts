import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import {
    oldUserTeacherCreationValidator,
    newUserTeacherCreationValidator,
    teacherUpdateValidator,
} from "../validators/TeacherValidator";
import { User } from "../entities/User";

const teacherRepository = appDataSource.getRepository(Teacher);
const userRepository = appDataSource.getRepository(User);

export const insertTeacher = async (
    code: string,
    password: string,
    kottebName: string,
    bonus: string,
    type: string,
    status: string,
    user: User
): Promise<Teacher> => {
    const teacher = new Teacher();
    teacher.code = code;
    teacher.password = password; //TODO: hash password or auto generate
    teacher.kotebName = kottebName;
    teacher.bonus = bonus;
    teacher.teacherType = type;
    teacher.currentStatus = status;
    teacher.teacherType = type;
    teacher.user = user;
    await teacherRepository.save(teacher);
    return teacher;
};

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const userId = req.body?.identifier;
        if (userId) {
            const { error } = oldUserTeacherCreationValidator.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });
            let user = await userRepository.findOne({ where: { identifier: userId } });
            if (user) {
                const { code, password, kotebName, bonus, type, currentStatus } = req.body;
                const teacher = await insertTeacher(code, password, kotebName, bonus, type, currentStatus, user);
                res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
            } else {
                res.status(404).json({
                    success: false,
                    message: `Unable to find corresponding user with identifier: ${userId}`,
                });
            }
        } else {
            const { error } = newUserTeacherCreationValidator.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });
            const { code, password, kotebName, bonus, type, currentStatus, firstName, lastName, birthDate } = req.body;
            var user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.birthDate = birthDate;
            await userRepository.save(user);
            const teacher = await insertTeacher(code, password, kotebName, bonus, type, currentStatus, user);
            res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error });
    }
};

export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await teacherRepository.find({ where: { isDeleted: false } });
        res.status(200).json({ success: true, message: "get teachers successfully", data: teachers });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
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
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({ success: true, message: "get teacher successfully", data: teacher });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};

export const updateTeacher = async (req: Request, res: Response) => {
    const { error } = teacherUpdateValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const teacherId = req.params.id;
        const updatedFields = req.body; // Get updated fields from request body

        const teacher = await teacherRepository.findOne({
            where: { id: teacherId, isDeleted: false },
            relations: ["user"],
        });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        // Update teacher fields
        await teacherRepository.update(teacherId, updatedFields);

        // Update associated user fields if exists
        if (teacher.user) {
            const userId = teacher.user.id;
            await userRepository.update(userId, updatedFields);
        }

        res.status(200).json({ success: true, message: "Teacher and associated user updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.id;
        const teacher = await teacherRepository.findOne({ where: { id: teacherId } });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        if (teacher.isDeleted) {
            return res.status(400).json({ success: false, message: "Teacher is already marked for deletion!" });
        }
        await teacherRepository.update(teacherId, { isDeleted: true });

        res.status(200).json({ success: true, message: "Teacher is marked for deletion!is marked for deletion!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getTeacherByCode = async (req: Request, res: Response) => {
    try {
        const teacherCode = req.params.code;
        const teacher = await teacherRepository.findOne({ where: { code: teacherCode, isDeleted: false } });

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({ success: true, message: "get teacher successfully", data: teacher });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};
