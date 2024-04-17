import { NextFunction, type Request, type Response } from "express";
import { UserValidator } from "../validators/UserValidator";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";
import { GroupService } from "../services/GroupService";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = UserValidator.selfUpdate.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        const id = res.locals.decodedToken.userId;
        // update the user corresponding to the teacher
        await UserService.updateUserById({ ...value, id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = res.locals.decodedToken.id;
        const groups = await GroupService.getTeacherGroups(teacherId, res.locals.paging);
        return Responses.FetchSucess(res, groups);
    } catch (error) {
        next(error);
    }
};
