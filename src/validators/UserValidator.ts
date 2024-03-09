import Joi from "joi";

export const userCreationValidator = Joi.object({
    identifier: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    fatherName: Joi.string(),
    grandFatherName: Joi.string(),
    motherFirstName: Joi.string(),
    motherLastName: Joi.string(),
    birthday: Joi.date().required(),
    birthPlace: Joi.string(),
    phoneNumber: Joi.string(),
    fatherPhoneNumber: Joi.string(),
    motherPhoneNumber: Joi.string(),
    gender: Joi.string(),
    cin: Joi.string(),
    hasNationalIDcard: Joi.boolean(),
    hasGuaranteedBirthCertificate: Joi.boolean(),
    hasPassport: Joi.boolean(),
}).options({ stripUnknown: true });
