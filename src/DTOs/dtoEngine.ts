import "reflect-metadata";
import * as Joi from "joi";

const DTO_FIELD_NAME = "dtoFields";

export interface DtoFieldConfig {
    dtoNames: string[];
    validator: Joi.Schema;
    attributeName?: string;
}

export function DtoField({ dtoNames, validator, attributeName }: DtoFieldConfig) {
    return function (target: any, propertyKey: string, attributeName?: string) {
        for (const dtoName of dtoNames) {
            const dtoFieldsMetadataKey = DTO_FIELD_NAME + dtoName;
            const existingDtoFields = Reflect.getMetadata(dtoFieldsMetadataKey, target) || {};
            attributeName = attributeName ?? propertyKey;
            existingDtoFields[propertyKey] = { dtoName, validator, attributeName };
            Reflect.defineMetadata(dtoFieldsMetadataKey, existingDtoFields, target);
        }
    };
}

type MetaField = Record<
    string,
    {
        dtoName: string;
        validator?: Joi.Schema<any> | undefined;
        attributeName: string;
    }
>;

export interface DtoMetaData {
    name: string;
    fields: MetaField;
}

export function generateDtoMetaData(dtoName: string, prototype: any, prototype2?: any): DtoMetaData {
    const fields1 = Reflect.getMetadata(DTO_FIELD_NAME + dtoName, prototype) as MetaField;
    let fields2: MetaField | undefined = undefined;

    if (prototype2 != undefined) {
        fields2 = Reflect.getMetadata(DTO_FIELD_NAME + dtoName, prototype2) as MetaField;
    }
    // TODO: remame fields case of collision ?
    const fields: MetaField = { ...fields1, ...fields2 };
    return {
        name: dtoName,
        fields,
    } as DtoMetaData;
}

export function mapToDto<T, Q = {}>(dtoMetaData: DtoMetaData, entity: any): any {
    const dto: any = {};
    const validationErrors: Joi.ValidationError[] = [];

    for (const propertyKey in dtoMetaData.fields) {
        const { dtoName: fieldName, validator, attributeName } = dtoMetaData.fields[propertyKey];
        let propertyValue: any = undefined;
        if (entity.hasOwnProperty(attributeName)) {
            propertyValue = (entity as any)[attributeName];
            // Validate the field against its validators
            if (validator) {
                const { error, value } = validator.label(attributeName).validate(propertyValue);
                if (error) {
                    validationErrors.push(error);
                } else {
                    dto[attributeName] = value;
                }
            } else {
                dto[attributeName] = propertyValue;
            }
        }
    }

    if (validationErrors.length > 0) {
        throw new DtoValidationError(validationErrors);
    }
    return dto;
}

export class DtoValidationError extends Error {
    constructor(validationErrors: Joi.ValidationError[]) {
        super(`${validationErrors.map((error) => error.message).join(", ")}`);
    }
}
