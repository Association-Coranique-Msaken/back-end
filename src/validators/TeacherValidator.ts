import Joi from "joi";
export const teacherCreationValidator = Joi.object({
    code: Joi.string().required(),
    password: Joi.string().required(),
    kotebName: Joi.string(),
    prim: Joi.string(),
    teacherType: Joi.string(),
    statue: Joi.string(),
}).options({ stripUnknown: true });
