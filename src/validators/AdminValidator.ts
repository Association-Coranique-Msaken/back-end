import Joi from "joi";
import { UserValidator } from "./UserValidator";

export class AdminValidator {
    private static schema = Joi.object({
        username: Joi.string(),
        password: Joi.string(),
        role: Joi.string().valid("fullAccessAdmin", "limitedAccess", "readOnly"),
        identifier: Joi.string(),
    }).options({ stripUnknown: true });

    public static creation = this.schema.options({ presence: "required" }).required();
    public static update = this.schema.fork(["username"], (s) => s.required());

    public static creationWithUser = this.creation
        .fork(["identifier"], () => Joi.any().strip())
        .concat(UserValidator.creation);
}
