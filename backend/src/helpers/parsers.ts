import { PagingOrder } from "../DTOs/paging/order";

export function parseAsNumber(
    queryParam: any,
    defaultValue: number
): number {
    if (typeof queryParam === "string") {
        const parsedNumber = parseFloat(queryParam);
        return isNaN(parsedNumber) ? defaultValue : parsedNumber;
    }
    return defaultValue;
}

export function parseAsString(
    queryParam: any,
    defaultValue: string
): string {
    if (typeof queryParam === "string") {
        return queryParam;
    }
    return defaultValue;
}

export function parseAsOrder(
    queryParam: any,
    defaultValue: PagingOrder
): PagingOrder {
    if (typeof queryParam === "string") {
        if (Object.values(PagingOrder).includes(queryParam as PagingOrder)) {
            return queryParam as unknown as PagingOrder; // Type assertion is safe here as we've already checked if it's part of the enum
        } else {
            return defaultValue;
        }
    }
    return defaultValue;
}

export function parseDate(dateStr: string): Date {
    const timestamp = Date.parse(dateStr);
    if (isNaN(timestamp)) {
        throw new Error("Invalid date string");
    }
    return new Date(timestamp);
}
