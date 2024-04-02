import { PagingOrder } from "./Order";

export class PageOptionsDto {
    readonly order: PagingOrder = PagingOrder.ASC;
    readonly orderBy: string = "createdAt";
    readonly pageNumber: number = 1;
    readonly pageSize: number = 10;

    get skip(): number {
        return (this.pageNumber - 1) * this.pageSize;
    }
}
