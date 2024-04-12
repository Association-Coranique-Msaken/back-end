import { NextFunction, type Request, type Response } from "express";
import { UserValidator } from "../validators/UserValidator";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = UserValidator.selfUpdate.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const id = res.locals.decodedToken.id;
        await UserService.updateUserById({ ...req.body, id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
