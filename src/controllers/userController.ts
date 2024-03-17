import { Request, Response } from "express";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { userCreationValidator, userUpdateValidator } from "../validators/UserValidator";

const userRepository = appDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    const { error } = userCreationValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    try {
        const userIdentifier = req.body.identifier;

        let user = await userRepository.findOne({ where: { identifier: userIdentifier } });

        if (user) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }
        // Get the current year
        const currentYear = new Date().getFullYear();
        // Get the latest user to retrieve the counter value
        const latestUser = await userRepository.findOne({ order: { id: "DESC" } });

        // Determine the new identifier based on the latest user's counter
        const counter = latestUser ? parseInt(latestUser.identifier) : 1;
        const identifier = `${currentYear}${counter.toString()}`;
        const newUser = await userRepository.create({ ...req.body, identifier });
        await userRepository.save(newUser);
        res.status(201).json({ success: true, message: "User created successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

//TODO Add pagination and redis caching
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find({ where: { isDeleted: false } });
        res.status(200).json({ success: true, message: "get users successfully", data: users });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "get user successfully", data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { error } = userUpdateValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await userRepository.update(userId, req.body);
        res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isDeleted) {
            return res.status(400).json({ success: false, message: "User is already marked for deletion!" });
        }
        await userRepository.update(userId, { isDeleted: true });

        res.status(200).json({ success: true, message: "User is marked for deletion!is marked for deletion!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};
