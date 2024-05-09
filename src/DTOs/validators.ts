import Joi from "joi";
import { parseDate } from "../helpers/parsers";

export class Validators {
    public static readonly TEXT = Joi.string().max(50).trim();
    public static readonly REQ_TEXT = Validators.TEXT.required();

    public static readonly PASS = Joi.string().min(6).max(50).required();

    private static readonly DATE_REGEX = /^(0?[1-9]|1[0-2])([\/\-\.])(0?[1-9]|[1-2][0-9]|3[0-1])\2(\d{4})$/;
    public static readonly DATE = Joi.string()
        .trim()
        .regex(Validators.DATE_REGEX)
        .message("{{#label}} must be a valid date of the form MM/DD/YYYY");
    public static readonly REQ_DATE = Validators.DATE.required();
    public static readonly DATE_TRANSFORM = Validators.DATE.custom((value, helpers) => {
        try {
            return parseDate(value);
        } catch (e) {
            return helpers.error("any.invalid");
        }
    }, "custom date parsing");
    public static readonly REQ_DATE_TRANSFORM = Validators.DATE_TRANSFORM.required();

    public static readonly ONE_OF = (...strs: String[]) => Joi.string().valid(...strs);
    public static readonly REQ_ONE_OF = (...strs: String[]) => this.ONE_OF(...strs).required();

    public static readonly NUM = Joi.number().integer();
    public static readonly REQ_NUM = this.NUM.required();

    public static readonly BOOL = Joi.bool();
    public static readonly REQ_BOOL = this.BOOL.required();

    // Domain specific
    public static readonly CIN = Joi.string()
        .length(8)
        .trim()
        .regex(/^[0-9]+$/)
        .message("{{#label}} must be a valid CIN number");
    public static readonly REQ_CIN = this.CIN.required();

    public static readonly TEL = Joi.string()
        .min(7)
        .max(20)
        .trim()
        .regex(/^\+?[ 0-9]+$/)
        .message("{{#label}} must be a valid phone number");
    public static readonly REQ_TEL = this.TEL.required();

    public static readonly GUID = Joi.string()
        .regex(/^([0-9a-f]+\-)+([0-9a-f]+)$/)
        .message("{{#label}} must be a valid GUID");
    public static readonly REQ_GUID = this.GUID.required();

    public static readonly EMAIL = Joi.string().trim().email().lowercase().required();
    public static readonly REQ_EMAIL = this.EMAIL.required();

    public static readonly IDENTIFIER = Joi.string()
        .trim()
        .regex(/^((20[0-9]{2})(\d{3}))$/)
        .message("{{#label}} must be an identifier of the form 20XXXXX");
    public static readonly REQ_IDENTIFIER = this.IDENTIFIER.required();

    public static readonly CODE = Joi.string()
        .trim()
        .regex(/^(\d{3,4})$/)
        .message("{{#label}} must be a code of 3 or 4 digits");
    public static readonly REQ_CODE = this.CODE.required();

    public static readonly GRP_CODE = Joi.string()
        .trim()
        .regex(/^(\d{2,3})$/)
        .message("{{#label}} must be a code of 2 or 3 digits");
    public static readonly REQ_GRP_CODE = this.GRP_CODE.required();

    // for teacher codes
    public static readonly CODE_TYPE = Joi.string()
        .trim()
        .length(1)
        .regex(/^[1-9]$/)
        .min(1)
        .max(9);
    public static readonly REQ_CODE_TYPE = this.CODE_TYPE.required();
}
