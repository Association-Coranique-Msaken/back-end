import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/responses";
import { UserService } from "../services/userService";
import { mapToDto } from "../DTOs/dtoEngine";
import { DtoMeta } from "../DTOs/dtoMeta";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateUserDto = mapToDto(DtoMeta.updateUser.meta, req.body);
        const id = res.locals.decodedToken.id;
        await UserService.updateUserById({ ...updateUserDto, id });
        return Responses.UpdateSuccess(res);
    } catch (error) {
        next(error);
    }
};
