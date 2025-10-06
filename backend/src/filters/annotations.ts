import { QueryItemType, QueryRelation } from "./types";

const FILTRABLE_NAME = "Filtrable";

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
            const dtoFieldsMetadataKey = FILTRABLE_NAME + name;
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

export function generateFilterMetaData(name: string, ...prototypes: any[]): FiltrableMetaData {
    const fieldsList = prototypes.map(
        (prototype) => (Reflect.getMetadata(FILTRABLE_NAME + name, prototype) as MetaField) || {}
    );

    // Merge all fields
    const fields = Object.assign({}, ...fieldsList);

    return {
        name,
        fields,
    } as FiltrableMetaData;
}
