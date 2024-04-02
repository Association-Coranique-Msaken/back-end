import Joi from "joi";
import { UserValidator } from "./UserValidator";
import { EntityValidator } from "./EntityValidator";

export class AdminValidator {
    private static schema = Joi.object({
        username: Joi.string().optional(),
        password: Joi.string().optional(),
        role: Joi.string().valid("fullAccessAdmin", "limitedAccess", "readOnly").optional(),
        identifier: Joi.string().optional(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.options({ presence: "required" }).required();
    public static update = this.schema.concat(EntityValidator.schema);
    public static creationWithUser = this.creation
        .fork(["identifier"], (s) => s.optional().strip())
        .concat(UserValidator.creation);
}
