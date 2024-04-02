import { SummerGroupValidator } from "../validators/SummerGroupValidator";
import * as Joi from "@hapi/joi";
import "joi-extract-type";

export type CreateSummerGroupDto = Joi.extractType<typeof SummerGroupValidator.creation>;
export type UpdateSummerGroupDto = Joi.extractType<typeof SummerGroupValidator.update>;
