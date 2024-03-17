import Joi from "joi";

export const teacherCreationValidator = Joi.object({
    code: Joi.string().required(),
    password: Joi.string().required(),
    kotebName: Joi.string(),
    bonus: Joi.string(),
    type: Joi.string(),
    identifier: Joi.string(),
}).options({ stripUnknown: true });

export const teacherUpdateValidator = Joi.object({
    code: Joi.string().required(),
    kotebName: Joi.string(),
    bonus: Joi.string(),
    type: Joi.string(),
}).options({ stripUnknown: true });
