import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";
import { mapToDto } from "../DTOs/dtoEngine";
import { Dto } from "../DTOs/dtoMetadata";

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateUserdto = mapToDto(Dto.updateUser.meta, req.body);
        const id = res.locals.decodedToken.id;
        await UserService.updateUserById({ ...updateUserdto, id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
