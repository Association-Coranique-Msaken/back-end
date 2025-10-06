import { FilterQuery, QueryItem, QueryItemType, QueryRelation } from "./types";
import { FiltrableMetaData } from "./annotations";
import { parseDate } from "../helpers/parsers";

const parseQuery = (query: qs.ParsedQs, filterableMetaData: FiltrableMetaData): QueryItem[] => {
    const queryItems: QueryItem[] = [];
    for (const propertyKey in filterableMetaData.fields) {
        const { name, type, relation, attributeName, className } = filterableMetaData.fields[propertyKey];
        if (query.hasOwnProperty(attributeName)) {
            const filterValue = (query as any)[attributeName];
            const queryItem = {
                name: attributeName,
                value: filterValue,
                type: type,
                relation: relation,
                entityAlias: className.toLocaleLowerCase(),
            } as QueryItem;
            queryItems.push(queryItem);
        }
    }
    return queryItems;
};

const processValue = (value: string, type: QueryItemType): any => {
    switch (type) {
        case QueryItemType.DATE:
            return parseDate(value);
        case QueryItemType.STRING:
        case QueryItemType.EMAIL:
            return value.toLocaleLowerCase();
        case QueryItemType.BOOL:
            return JSON.parse(value.toLowerCase()) == true;
        default:
            return value.trim();
    }
};

const itemTypeToQueryPlaceholder = (type: QueryItemType): string => {
    switch (type) {
        case QueryItemType.CASE_SENSITIVE:
        case QueryItemType.STRING:
        case QueryItemType.UNKNOWN:
        case QueryItemType.EMAIL:
        case QueryItemType.NUMBER:
        case QueryItemType.BOOL:
        case QueryItemType.DATE:
        case QueryItemType.GUID:
            return "?";
    }
};

export const generateFilterQuery = (query: qs.ParsedQs, filterableMetaData: FiltrableMetaData): FilterQuery => {
    const parsedQuery = parseQuery(query, filterableMetaData);
    const filterList: string[] = [];
    const placeholders: { [id: string]: string } = {};
    for (const q of parsedQuery) {
        const fullName = `${q.entityAlias}.${q.name}`;
        const typePlaceholder = itemTypeToQueryPlaceholder(q.type);
        const rhs = q.relation.replace("?", typePlaceholder).replace("?", `:${fullName}`);
        filterList.push(`${fullName} ${rhs}`);
        placeholders[fullName] = processValue(q.value.toString(), q.type);
    }
    return { queryString: filterList.join(" AND "), placeholders: placeholders };
};
