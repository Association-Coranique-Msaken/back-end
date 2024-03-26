import Joi from "joi";

export class UserValidator {
    private static schema = Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        fatherFirstName: Joi.string().optional(),
        grandFatherFirstName: Joi.string().optional(),
        motherFirstName: Joi.string().optional(),
        motherLastName: Joi.string().optional(),
        birthDate: Joi.date().optional(),
        birthPlace: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        fatherPhoneNumber: Joi.string().optional(),
        motherPhoneNumber: Joi.string().optional(),
        gender: Joi.string().optional(),
        cin: Joi.string().optional(),
        hasNationalIDcard: Joi.boolean().optional(),
        hasGuaranteedBirthCertificate: Joi.boolean().optional(),
        hasPassport: Joi.boolean().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.fork(["firstName", "lastName", "birthDate"], (s) => s.required());

    public static update = this.schema.concat(
        Joi.object({
            id: Joi.string().required(),
            identifier: Joi.string().optional(),
        })
    );
}
