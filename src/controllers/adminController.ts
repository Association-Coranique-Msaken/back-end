import { Request, Response } from "express";
import { encrypt } from "../helpers/helpers";
import { appDataSource } from "../config/Database";
import { Admin } from "../entities/Admin";
import { adminCreationValidator } from "../validators/AdminValidator";

const adminRepository = appDataSource.getRepository(Admin);

export const getAdmin = async (req: Request, res: Response) => {
    try {
        const admins = await adminRepository.find();
        res.status(200).json({ succss: true, message: "fetch users successfully", data: admins });
    } catch (error) {
        res.status(404).json({ succss: false, message: error });
    }
};
export const createAdmin = async (req: Request, res: Response) => {
    const { error } = adminCreationValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
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
        res.status(201).json({ success: true, message: "Admin created successfully", data: admin });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};
