import * as Joi from "@hapi/joi";
import "joi-extract-type";
import { TeacherValidator } from "../validators/TeacherValidator";

export type CreateTeacherDto = Joi.extractType<typeof TeacherValidator.creation>;
export type UpdateTeacherDto = Joi.extractType<typeof TeacherValidator.update>;
