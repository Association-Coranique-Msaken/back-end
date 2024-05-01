export class FilterItem {
    name: string;
    relation: string;
}

export enum QueryRelation {
    EQ = " = ?",
    CONTAINS = ' LIKE "%?%"',
    STARTS_WITH = ' LIKE "?%"',
    ENDS_WITH = ' LIKE "%?"',
    IN = " IN [?]",
}

export enum QueryItemType {
    STRING,
    CASE_SENSITIVE,
    BOOL,
    NUMBER,
    DATE,
    UNKOWN,
    EMAIL,
    GUID,
}

export class QueryItem {
    name: string;
    value: any;
    type: QueryItemType;
    relation: QueryRelation;
    entityAlias: string;
}

export class FilterQuery {
    queryString: string;
    placeholders: { [id: string]: string };
}
