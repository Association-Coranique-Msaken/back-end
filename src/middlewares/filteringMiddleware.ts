import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/Responses";
import { AdminValidator } from "../validators/AdminValidator";
import Joi from "joi";
import { UserValidator } from "../validators/UserValidator";
import { TeacherValidator } from "../validators/TeacherValidator";
import { FormativeYearGroupValidator, SummerGroupValidator } from "../validators/GroupValidator";

export type FilterQuery = { queryString: string; placeholders: {} };

const filterMiddlewareFactory =
    (schemas: { prefix: string; schema: Joi.ObjectSchema<any> }[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let result: FilterQuery = { queryString: "", placeholders: {} };
            for (let schema of schemas) {
                result = getFilterQueryFromValidator(req.query, result, schema.prefix, schema.schema);
            }
            res.locals.filter = result;
            next();
        } catch (error: any) {
            console.log(error);
            return Responses.InternalServerError(res);
        }
    };

export class FilterItem {
    name: string;
    relation: string;
}

const generateFiltersFromValidator = (schema: Joi.ObjectSchema<any>) => {
    const validatorElements = schema.describe().keys;
    const keys = Object.keys(validatorElements);
    let filterItems: FilterItem[] = new Array<FilterItem>();
    for (const key of keys) {
        const type = validatorElements[key].type;
        let relation: string = "";
        switch (type) {
            case "boolean":
                relation = " = ?";
                break;
            case "date":
                relation = ' = "?"';
                break;
            case "number":
                relation = " = ?";
                break;
            case "string":
                relation = ' LIKE "%"?"%" ';
                break;
        }
        filterItems.push({ name: key, relation: relation });
    }
    return filterItems;
};

const getFilterQueryFromValidator = (
    query: any,
    appendTo: FilterQuery,
    prefix: string,
    schema: Joi.ObjectSchema<any>
): FilterQuery => {
    const filters = generateFiltersFromValidator(schema);
    let parsedFilters: string = "";
    let placeholders: { [id: string]: string } = {};
    for (let queryParam in query) {
        let match = filters.find((x) => x.name == queryParam);
        const value = query[queryParam]?.toString();
        if (match && value) {
            if (parsedFilters.length > 0) {
                parsedFilters += " AND ";
            }
            parsedFilters +=
                prefix + "." + queryParam + " " + match.relation.replace("?", `:${prefix}_${queryParam}`) + " ";
            placeholders[`${prefix}_${queryParam}`] = value;
        }
    }

    let resultQueryString = "";
    if (appendTo.queryString?.length > 0 && parsedFilters.length > 0) {
        resultQueryString = appendTo.queryString + " AND " + parsedFilters;
    } else {
        resultQueryString = appendTo.queryString + parsedFilters;
    }
    return { queryString: resultQueryString, placeholders: { ...appendTo.placeholders, ...placeholders } };
};

export const adminFilterMiddleware = filterMiddlewareFactory([
    { prefix: "admin", schema: AdminValidator.update },
    { prefix: "user", schema: UserValidator.update },
]);
export const userFilterMiddleware = filterMiddlewareFactory([{ prefix: "user", schema: UserValidator.update }]);
export const teacherFilterMiddleware = filterMiddlewareFactory([
    { prefix: "teacher", schema: TeacherValidator.update },
    { prefix: "user", schema: UserValidator.update },
]);
export const groupFilterMiddleware = filterMiddlewareFactory([
    { prefix: "group", schema: SummerGroupValidator.update },
    { prefix: "group", schema: FormativeYearGroupValidator.update },
]);
