import Joi from "joi";

export class TeacherValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        password: Joi.string().optional(),
        kotebName: Joi.string().optional(),
        bonus: Joi.string().optional(),
        type: Joi.string().optional(),
        identifier: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.fork(["code", "password", "identifier"], (s) => s.required());

    public static update = this.schema.concat(
        Joi.object({
            id: Joi.string().required(),
            isActive: Joi.string(),
        })
    );
}
