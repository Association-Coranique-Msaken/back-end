import Joi from "joi";

export const oldUserTeacherCreationValidator = Joi.object({
    code: Joi.string().required(),
    password: Joi.string().required(),
    kotebName: Joi.string(),
    bonus: Joi.string(),
    type: Joi.string(),
    currentStatus: Joi.string(),
}).options({ stripUnknown: true });

export const newUserTeacherCreationValidator = oldUserTeacherCreationValidator
    .append({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        birthDate: Joi.date().required(),
    })
    .options({ stripUnknown: true });

export const teacherUpdateValidator = Joi.object({
    code: Joi.string().required(),
    kotebName: Joi.string(),
    bonus: Joi.string(),
    type: Joi.string(),
    currentStatus: Joi.string(),
}).options({ stripUnknown: true });
