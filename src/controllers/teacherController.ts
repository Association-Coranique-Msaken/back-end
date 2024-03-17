import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { oldUserTeacherCreationValidator, newUserTeacherCreationValidator } from "../validators/TeacherValidator";
import { User } from "../entities/User";

const teacherRepository = appDataSource.getRepository(Teacher);
const usersRepository = appDataSource.getRepository(User);

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const userId = req.body?.identifier;
        if (userId) {
            const { error } = oldUserTeacherCreationValidator.validate(req.body);
            if (error) return res.status(400).json({ success: false, message: error.details[0].message });
            let user = await usersRepository.findOne({ where: { identifier: userId } });
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
            await usersRepository.save(user);
            const teacher = await insertTeacher(code, password, kotebName, bonus, type, currentStatus, user);
            res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error });
    }
};

export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await teacherRepository.find();
        res.status(200).json({ success: true, message: "get teachers successfully", data: teachers });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};

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
