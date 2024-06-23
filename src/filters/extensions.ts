import { SelectQueryBuilder } from "typeorm";
import { FilterQuery } from "./types";

// Declare the Extension
declare module "typeorm" {
    interface SelectQueryBuilder<Entity> {
        addFilters(filters: FilterQuery): this;
    }
}

SelectQueryBuilder.prototype.addFilters = function (filters: FilterQuery) {
    if (filters.queryString.length == 0) {
        return this;
    }
    return this.andWhere(filters.queryString, { ...filters.placeholders });
};
