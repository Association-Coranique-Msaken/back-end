import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/responses";
import { generateFilterQuery } from "../filters/parser";
import { FiltrableMetaData } from "../filters/annotations";
import {
    AdminListFilterMeta,
    GroupListFilterMeta,
    TeacherListFilterMeta,
    UserListFilterMeta,
} from "../filters/metaData";

const filterMiddlewareFactory =
    (filterableMetaData: FiltrableMetaData) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = generateFilterQuery(req.query, filterableMetaData);
            res.locals.filter = result;
            next();
        } catch (error: any) {
            console.log(error);
            // TODO: better error reporting.
            return Responses.InternalServerError(res);
        }
    };

export const adminListFilterMiddleware = filterMiddlewareFactory(AdminListFilterMeta);
export const groupListFilterMiddleware = filterMiddlewareFactory(GroupListFilterMeta);
export const userListFilterMiddleware = filterMiddlewareFactory(UserListFilterMeta);
export const teacherListFilterMiddleware = filterMiddlewareFactory(TeacherListFilterMeta);
