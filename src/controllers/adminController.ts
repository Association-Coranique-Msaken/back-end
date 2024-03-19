import { Request, Response } from "express";
import { encrypt } from "../helpers/helpers";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { adminCreationValidator } from "../validators/AdminValidator";
import { Responses } from "../helpers/Responses";

const adminRepository = appDataSource.getRepository(Admin);

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const admins = await adminRepository.find();
        return Responses.FetchSucess(res, admins);
    } catch (error) {
        return Responses.NotFound(res);
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    const { error } = adminCreationValidator.validate(req.body);
    if (error) {
        return Responses.ValidationBadRequest(res, error);
    }
    try {
        // const admin = new Admin({ ...req.body });
        const { username, firstName, lastName, password, role } = req.body;
        const admin = new Admin();
        admin.username = username;
        admin.firstName = firstName;
        admin.lastName = lastName;
        admin.password = await encrypt.encryptpass(password);
        admin.role = role;
        await adminRepository.save(admin);
        return Responses.CreateSucess(res, admin);
    } catch (error) {
        return Responses.InternalServerError(res);
    }
};
