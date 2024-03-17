import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { userCreationValidator } from "../validators/UserValidator";

const usersRepository = appDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    const { error } = userCreationValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    try {
        const user = await usersRepository.create(req.body);
        await usersRepository.save(user);
        res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await usersRepository.find();
        res.status(200).json({ success: true, message: "users fetched successfully.", data: users });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};
