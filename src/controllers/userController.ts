import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { userCreationValidator, userUpdateValidator } from "../validators/UserValidator";
import { Not } from "typeorm";
import { Responses } from "../helpers/Responses";

const userRepository = appDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    const { error } = userCreationValidator.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        // Get the current year
        const currentYear = new Date().getFullYear();
        // Get the latest user to retrieve the counter value
        // TODO: replace with query to avoid the 'not'.
        const latestUser = await userRepository.findOne({
            where: { identifier: Not("") },
            order: { identifier: "DESC" },
        });

        // Determine the new identifier based on the latest user's counter
        const counter = latestUser ? parseInt(latestUser.identifier) : 1;
        const identifier = `${currentYear}${counter.toString()}`;
        const newUser = await userRepository.create({ ...req.body, identifier });
        await userRepository.save(newUser);
        return Responses.CreateSucess(res, newUser);
    } catch (error) {
        console.error(error);
        return Responses.InternalServerError(res);
    }
};

// TODO Add pagination and redis caching
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userRepository.find({ where: { isDeleted: false } });
        return Responses.FetchSucess(res, users);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });

        if (!user) {
            return Responses.NotFound(res);
        }

        return Responses.FetchSucess(res, user);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { error } = userUpdateValidator.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }

    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId, isDeleted: false } });

        if (!user) {
            return Responses.NotFound(res);
        }
        await userRepository.update(userId, req.body);
        return Responses.UpdateSucess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
            return Responses.NotFound(res);
        }
        if (user.isDeleted) {
            return Responses.AlreadyDeleted(res);
        }
        await userRepository.update(userId, { isDeleted: true });
        return Responses.DeleteSuccess(res);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};
