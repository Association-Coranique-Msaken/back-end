import { QueryItemType, QueryRelation } from "./types";

const FITRABLE_NAME = "Filtrable";

export interface FilterableConfig {
    names?: string[];
    type?: QueryItemType;
    fieldName?: string;
    relation?: QueryRelation;
}

const deduceRelationFromType = (type: QueryItemType): QueryRelation => {
    switch (type) {
        case QueryItemType.STRING:
            return QueryRelation.CONTAINS;
        default:
            return QueryRelation.EQ;
    }
};

export function Filterable(options?: FilterableConfig): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        const className = target.constructor.name.toLowerCase();
        const names = options?.names ?? [className];
        for (const name of names) {
            const dtoFieldsMetadataKey = FITRABLE_NAME + name;
            const existingDtoFields = Reflect.getMetadata(dtoFieldsMetadataKey, target) || {};
            const type = options?.type ?? QueryItemType.STRING;
            const attributeName = options?.fieldName ?? propertyKey.toString();
            const relation = options?.relation ?? deduceRelationFromType(type);
            existingDtoFields[propertyKey] = { name, type, relation, attributeName, className };
            Reflect.defineMetadata(dtoFieldsMetadataKey, existingDtoFields, target);
        }
    };
}

type MetaField = Record<
    string,
    {
        name: string;
        type: QueryItemType;
        relation: QueryRelation;
        attributeName: string;
        className: string;
    }
>;

export interface FiltrableMetaData {
    name: string;
    fields: MetaField;
}

export function generateFilterMetaData(name: string, prototype: any, prototype2?: any): FiltrableMetaData {
    name = name.toLowerCase();
    const fields1 = Reflect.getMetadata(FITRABLE_NAME + name, prototype) as MetaField;
    let fields2: MetaField | undefined = undefined;

    if (prototype2 != undefined) {
        fields2 = Reflect.getMetadata(FITRABLE_NAME + name, prototype2) as MetaField;
    }
    // TODO: remame fields case of collision ?
    const fields: MetaField = { ...fields1, ...fields2 };
    return {
        name,
        fields,
    } as FiltrableMetaData;
}
