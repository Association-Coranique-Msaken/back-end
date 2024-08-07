import "reflect-metadata";
import * as Joi from "joi";

const DTO_FIELD_NAME = "dtoFields";

export interface DtoFieldConfig {
    dto: string[];
    validator: Joi.Schema;
    attributeName?: string;
}

export function DtoField({ dto: dtoNames, validator, attributeName }: DtoFieldConfig): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        const className = target.constructor.name;
        for (const dtoName of dtoNames) {
            const dtoFieldsMetadataKey = DTO_FIELD_NAME + dtoName;
            const existingDtoFields = Reflect.getMetadata(dtoFieldsMetadataKey, target) || {};
            attributeName = attributeName ?? propertyKey.toString();
            existingDtoFields[propertyKey] = { dtoName, validator, attributeName, className };
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
        className: string;
    }
>;

export interface DtoMetaData {
    name: string;
    fields: MetaField;
}

export function generateDtoMetaData(dtoName: string, ...prototypes: any[]): DtoMetaData {
    const fieldsList = prototypes.map(
        (prototype) => (Reflect.getMetadata(DTO_FIELD_NAME + dtoName, prototype) as MetaField) || {}
    );

    // Merge all fields
    const fields = Object.assign({}, ...fieldsList);

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
        } else {
            const { error } = validator?.label(attributeName).validate(undefined) ?? { error: undefined };
            if (error) {
                validationErrors.push(error);
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
