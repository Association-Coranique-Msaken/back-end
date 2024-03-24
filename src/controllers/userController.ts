import { NextFunction, type Request, type Response } from "express";
import { UserValidator } from "../validators/UserValidator";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = UserValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const user = await UserService.createUser(req.body);
        return Responses.CreateSucess(res, user);
    } catch (error) {
        next(error);
    }
};

// TODO Add pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
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
        const user = await UserService.getUserById(req.params.id);
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
        await UserService.updateUser(req.body);
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
        await UserService.deleteUser(req.params.id);
        return Responses.DeleteSuccess(res);
    } catch (error) {
        next(error);
    }
};
