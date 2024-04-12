import Joi from "joi";

export class FormativeYearGroupValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        days: Joi.string().optional(),
        timeRange: Joi.string().optional(),
        roomNumber: Joi.number().optional(),
        courseType: Joi.string().valid("practical", "theoretical").optional(),
        levelOrNumHizbs: Joi.string().optional(),
        numStudents: Joi.number().optional(),
        teacherId: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.options({ presence: "required" }).required();
    public static update = this.schema;
}

export class SummerGroupValidator {
    private static schema = Joi.object({
        code: Joi.string().optional(),
        levelOrNumHizbs: Joi.string().optional(),
        days: Joi.string().optional(),
        courseType: Joi.string().valid("summerGroup").optional(),
        timeRange: Joi.string().optional(),
        roomNumber: Joi.number().optional(),
        maxStudents: Joi.number().optional(),
        numStudents: Joi.number().optional(),
        inactiveStudents: Joi.number().optional(),
        teacherId: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema
        .fork(["inactiveStudents"], (s) => s.optional().strip())
        .options({ presence: "required" })
        .required();

    public static update = this.schema;
}
