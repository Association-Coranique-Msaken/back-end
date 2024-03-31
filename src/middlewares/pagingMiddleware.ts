import { type Request, type Response, type NextFunction } from "express";
import { Responses } from "../helpers/Responses";
import { parseAsNumber, parseAsOrder, parseAsString } from "../helpers/helpers";
import { PagingOrder } from "../DTOs/Order";
import { PageOptionsDto } from "../DTOs/PageOptionsDto";

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
        next();
    } catch (error: any) {
        console.log(error);
        return Responses.InternalServerError(res);
    }
};
