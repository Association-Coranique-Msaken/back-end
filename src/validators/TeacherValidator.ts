import Joi from "joi";
import { EntityValidator } from "./EntityValidator";

export class TeacherValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        password: Joi.string().optional(),
        kotebName: Joi.string().optional(),
        bonus: Joi.string().optional(),
        type: Joi.string().optional(),
        identifier: Joi.string().optional(),
        isActive: Joi.boolean().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.fork(["code", "password", "identifier"], (s) => s.required());

    public static update = this.schema.concat(EntityValidator.schema);
}
