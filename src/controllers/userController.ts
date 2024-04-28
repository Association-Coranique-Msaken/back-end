import { NextFunction, type Request, type Response } from "express";
import { Responses } from "../helpers/Responses";
import { UserService } from "../services/userService";
import { generateDtoMetaData, mapToDto } from "../DTOs/dtoEngine";
import { User } from "../entities/User";

const updateUserDtoMeta = generateDtoMetaData("UpdateUserDto", User.prototype);

export const updateData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateUserdto = mapToDto(updateUserDtoMeta, req.body);
        const id = res.locals.decodedToken.id;
        await UserService.updateUserById({ ...updateUserdto, id });
        return Responses.UpdateSucess(res);
    } catch (error) {
        next(error);
    }
};
