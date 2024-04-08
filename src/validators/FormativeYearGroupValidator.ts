import Joi from "joi";
import { EntityValidator } from "./EntityValidator";

export class FormativeYearGroupValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        days: Joi.string().optional(),
        timeRange: Joi.string().optional(),
        roomNumber: Joi.number().optional(),
        courseType: Joi.string().valid("practical", "theoretical").optional(),
        level: Joi.number().optional(),
        numStudents: Joi.number().optional(),
        teacher: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.options({ presence: "required" }).required();
    public static update = this.schema.concat(EntityValidator.schema);
}
