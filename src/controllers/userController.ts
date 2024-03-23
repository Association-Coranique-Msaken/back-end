import { type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { User } from "../entities/User";
import { userCreationValidator, userUpdateValidator } from "../validators/UserValidator";
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

        // TODO: Add lock here to prevent race condition in case of parallel requests.
        const identifier = await getNewUserIdentifier();
        const newUser = userRepository.create({ ...req.body, identifier });
        await userRepository.save(newUser);
        return Responses.CreateSucess(res, newUser);
    } catch (error) {
        console.error(error);
        return Responses.InternalServerError(res);
    }
};

export const getNewUserIdentifier = async () => {
    const queryResult = await appDataSource
        .createQueryBuilder()
        .select("MAX(`identifier`)", "id")
        .from(User, "user")
        .execute();
    const perviousIdentifier = queryResult?.[0]?.id;
    const currentYear = new Date().getFullYear();
    return computeNextIdentifier(currentYear, perviousIdentifier);
};

export const computeNextIdentifier = (currentYear: number, perviousIdentifier?: string): string => {
    if (perviousIdentifier) {
        const previousIdentifierYear = parseInt(perviousIdentifier.substring(0, 4));
        if (currentYear > previousIdentifierYear) {
            return `${currentYear}001`;
        } else {
            const previousIncrementalOrder = parseInt(perviousIdentifier.substring(4, 8)) ?? 1;
            const nextIncrementalOrder = previousIncrementalOrder + 1;
            if (nextIncrementalOrder >= 1000) {
                return `${previousIdentifierYear + 1}000`;
            } else {
                return `${previousIdentifierYear}${nextIncrementalOrder.toString().padStart(3, "0")}`;
            }
        }
    } else {
        return `${currentYear}001`;
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
