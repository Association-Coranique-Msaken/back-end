import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/responses";
import { parseAsNumber, parseAsOrder, parseAsString } from "../helpers/parsers";
import { PagingOrder } from "../DTOs/paging/order";
import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { PagingValidator } from "../DTOs/paging/pagingValidator";

export const pagingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderBy: string = parseAsString(req.query.orderBy, "createdAt");
        const order: PagingOrder = parseAsOrder(req.query.order, PagingOrder.DESC);
        const pageNumber: number = parseAsNumber(req.query.pageNumber, 1);
        const pageSize: number = parseAsNumber(req.query.pageSize, 10);
        res.locals.paging = {
            orderBy: orderBy,
            order: order,
            pageNumber: pageNumber,
            pageSize: pageSize,
            skip: 0,
        } as PageOptionsDto;

        const { error } = PagingValidator.schema.validate(res.locals.paging);
        if (error) {
            return Responses.ValidationBadRequest(res, error);
        }

        next();
    } catch (error: any) {
        console.log(error);
        return Responses.InternalServerError(res);
    }
};
