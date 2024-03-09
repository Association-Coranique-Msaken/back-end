import Joi from "joi";

export const adminCreationValidator = Joi.object({
    username: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string(),
    role: Joi.string().valid("fullAccessAdmin", "limitedAccess", "readOnly").required(),
});
