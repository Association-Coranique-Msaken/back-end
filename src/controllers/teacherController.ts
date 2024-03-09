import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { Teacher } from "../entities/Teacher";
import { teacherCreationValidator } from "../validators/TeacherValidator";
import { User } from "../entities/User";

const teacherRepository = appDataSource.getRepository(Teacher);
const usersRepository = appDataSource.getRepository(User);

export const createTeacher = async (req: Request, res: Response) => {
    const { error } = teacherCreationValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { firstName, lastName, birthday, identifier } = req.body;

    try {
        // Check if user with the provided identifier already exists
        let user = await usersRepository.findOne({ where: { identifier: identifier } });

        // If user does not exist, create a new user
        if (!user) {
            user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.birthday = birthday;
            user.identifier = identifier;
            await usersRepository.save(user);
        }

        // Create Teacher entity
        const teacher = new Teacher();
        teacher.code = req.body.code;
        teacher.password = req.body.password; //TODO: hash password or auto generate
        teacher.kotebName = req.body.kotebName;
        teacher.prim = req.body.prim;
        teacher.teacherType = req.body.type;
        teacher.statue = req.body.statue;
        teacher.user = user;

        // Save teacher entity
        await teacherRepository.save(teacher);

        res.status(201).json({ success: true, message: "Teacher created successfully", data: teacher });
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
