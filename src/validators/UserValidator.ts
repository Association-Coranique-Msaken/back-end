import Joi from "joi";

export class UserValidator {
    private static schema = Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        fatherName: Joi.string(),
        grandFatherName: Joi.string(),
        motherFirstName: Joi.string(),
        motherLastName: Joi.string(),
        birthDate: Joi.date(),
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

    public static creation = this.schema.fork(["firstName", "lastName", "birthDate"], (s) => s.required());

    public static update = this.schema.concat(
        Joi.object({
            id: Joi.string().required(),
            identifier: Joi.string(),
        })
    );
}
