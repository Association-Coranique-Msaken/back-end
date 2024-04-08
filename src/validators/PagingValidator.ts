import Joi from "joi";

export class PagingValidator {
    public static schema = Joi.object({
        orderBy: Joi.string().optional(),
        order: Joi.string().valid("ASC", "DESC").optional(),
        pageNumber: Joi.number().positive().min(1).optional(),
        pageSize: Joi.number().positive().min(1).optional(),
    }).options({ stripUnknown: true });
}
