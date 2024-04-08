import { NextFunction, type Request, type Response } from "express";
import { UserValidator } from "../validators/UserValidator";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";
import { SummerGroupService } from "../services/summerGroupService";
import { SummerGroupValidator } from "../validators/SummerGroupValidator";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = UserValidator.selfUpdate.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const id = res.locals.decodedToken.userId;
        // update the user corresponding to the teacher
        await UserService.updateUser({ ...req.body, id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = res.locals.decodedToken.userId;
        await SummerGroupService.getTeacherGroups(teacherId, res.locals.paging);
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
