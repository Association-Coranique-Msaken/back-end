import { FormativeYearGroupValidator, SummerGroupValidator } from "../validators/GroupValidator";
import * as Joi from "@hapi/joi";
import "joi-extract-type";

export type CreateFormativeYearGroupDto = Joi.extractType<typeof FormativeYearGroupValidator.creation>;
export type UpdateFormativeYearGroupDto = Joi.extractType<typeof FormativeYearGroupValidator.update>;
export type CreateSummerGroupDto = Joi.extractType<typeof SummerGroupValidator.creation>;
export type UpdateSummerGroupDto = Joi.extractType<typeof SummerGroupValidator.update>;
