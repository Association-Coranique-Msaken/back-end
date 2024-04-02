import { AdminValidator } from "../validators/AdminValidator";
import * as Joi from "@hapi/joi";
import "joi-extract-type";

export type CreateAdminDto = Joi.extractType<typeof AdminValidator.creation>;
export type UpdateAdminDto = Joi.extractType<typeof AdminValidator.update>;
export type CreateAdminWithUserDto = Joi.extractType<typeof AdminValidator.creationWithUser>;
