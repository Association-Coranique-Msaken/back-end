import Joi from "joi";
import { EntityValidator } from "./EntityValidator";

export class SummerGroupValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        numHizb: Joi.string().optional(),
        days: Joi.string().optional(),
        timeRange: Joi.string().optional(),
        roomNumber: Joi.number().optional(),
        maxStudents: Joi.number().optional(),
        numStudents: Joi.number().optional(),
        inactiveStudents: Joi.number().optional(),
        teacher: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema
        .fork(["inactiveStudents"], (s) => s.optional().strip())
        .options({ presence: "required" })
        .required();

    public static update = this.schema.concat(EntityValidator.schema);
}
