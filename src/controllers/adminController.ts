import { NextFunction, type Request, type Response } from "express";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { AdminValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";
import { AdminService } from "../services/adminService";

const adminRepository = appDataSource.getRepository(Admin);

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const admins = await adminRepository.find();
        return Responses.FetchSucess(res, admins);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = AdminValidator.creation.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        return await AdminService.createAdmin(req.body);
    } catch (error) {
        next(error);
    }
};
