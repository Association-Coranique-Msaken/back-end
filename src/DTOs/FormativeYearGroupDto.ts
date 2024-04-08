import { FormativeYearGroupValidator } from "../validators/FormativeYearGroupValidator";
import * as Joi from "@hapi/joi";
import "joi-extract-type";

export type CreateFormativeYearGroupDto = Joi.extractType<typeof FormativeYearGroupValidator.creation>;
export type UpdateFormativeYearGroupDto = Joi.extractType<typeof FormativeYearGroupValidator.update>;
