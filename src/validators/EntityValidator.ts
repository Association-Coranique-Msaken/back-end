import Joi from "joi";

export class EntityValidator {
    public static schema = Joi.object({
        id: Joi.string().required(),
        isDeleted: Joi.string().optional(),
    }).options({ stripUnknown: true });
}
