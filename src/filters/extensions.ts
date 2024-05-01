import { SelectQueryBuilder } from "typeorm";
import { FilterQuery } from "./types";

// Declare the Extension
declare module "typeorm" {
    interface SelectQueryBuilder<Entity> {
        addFilters(filters: FilterQuery): this;
    }
}

SelectQueryBuilder.prototype.addFilters = function (filters: FilterQuery) {
    return this.where(filters.queryString, { ...filters.placeholders });
};
