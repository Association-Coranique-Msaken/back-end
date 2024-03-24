import Joi from "joi";

export class TeacherValidator {
    private static schema = Joi.object({
        code: Joi.string(),
        password: Joi.string(),
        kotebName: Joi.string(),
        bonus: Joi.string(),
        type: Joi.string(),
        identifier: Joi.string(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.fork(["code", "password", "identifier"], (s) => s.required());

    public static update = this.schema.concat(Joi.object({ id: Joi.string().required() }));
}
