import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/responses";
import { UserService } from "../services/userService";
import { GroupService } from "../services/groupService";
import { mapToDto } from "../DTOs/dtoEngine";
import { DtoMeta } from "../DTOs/dtoMeta";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateUserdto = mapToDto(DtoMeta.updateUser.meta, req.body);
        const id = res.locals.decodedToken.userId;
        // update the user corresponding to the teacher
        await UserService.updateUserById({ ...updateUserdto, id });
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
