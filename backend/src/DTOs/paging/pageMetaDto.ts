import { PageMetaDtoParameters } from "./pageMetaDtoParameters";

export class PageMetaDto {
    readonly pageNumber: number;
    readonly pageSize: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
        this.pageNumber = pageOptionsDto.pageNumber;
        this.pageSize = pageOptionsDto.pageSize;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.pageSize);
        this.hasPreviousPage = this.pageNumber > 1;
        this.hasNextPage = this.pageNumber < this.pageCount;
    }
}
