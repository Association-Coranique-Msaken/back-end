import * as Joi from "@hapi/joi";
import "joi-extract-type";
import { UserValidator } from "../validators/UserValidator";

export type CreateUserDto = Joi.extractType<typeof UserValidator.creation>;
export type UpdateUserDto = Joi.extractType<typeof UserValidator.update>;
