import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { PagingOrder } from "../DTOs/paging/Order";
import { PageOptionsDto } from "../DTOs/paging/PageOptionsDto";
import { SelectQueryBuilder } from "typeorm";

dotenv.config();

export class encrypt {
    static async encryptpass(password: string) {
        return bcrypt.hashSync(password, 12);
    }

    static comparepassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(object: any) {
        if (!process.env.JWT_TOKEN_SECRET) throw new Error("TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_EXP_IN });
    }

    static generateRefreshToken(object: any) {
        if (!process.env.JWT_REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is undefined");
        return jwt.sign({ value: object }, process.env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXP_IN,
        });
    }
}

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export async function transformQueryOutput(entities: any[], aliases: string[]): Promise<Record<string, any>[][]> {
    const editedEntities: Record<string, any>[][] = await Promise.all(
        entities.map(async (entity) => {
            const objects: Record<string, any>[] = Array.from({ length: aliases.length }, () => ({}));
            await Promise.all(
                Object.keys(entity).map(async (key) => {
                    for (let i = 0; i < aliases.length; i++) {
                        if (key.startsWith(aliases[i])) {
                            const fieldName = key.replace(aliases[i], "");
                            objects[i][fieldName] = entity[key];
                        }
                    }
                })
            );
            return objects;
        })
    );
    let entitiesLists: Record<string, any>[][] = await Promise.all(
        aliases.map(async (alias, index) => {
            return await Promise.all(editedEntities.map(async (e) => e[index]));
        })
    );
    return entitiesLists;
}

export function parseAsNumber(
    queryParam: undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[],
    defaultValue: number
): number {
    if (typeof queryParam === "string") {
        const parsedNumber = parseFloat(queryParam);
        return isNaN(parsedNumber) ? defaultValue : parsedNumber;
    }
    return defaultValue;
}

export function parseAsString(
    queryParam: undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[],
    defaultValue: string
): string {
    if (typeof queryParam === "string") {
        return queryParam;
    }
    return defaultValue;
}

export function parseAsOrder(
    queryParam: undefined | string | string[] | qs.ParsedQs | qs.ParsedQs[],
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

// Declare the Extension
declare module "typeorm" {
    interface SelectQueryBuilder<Entity> {
        addPaging(pageOptionsDto: PageOptionsDto, alias?: string): this;
    }
}

SelectQueryBuilder.prototype.addPaging = function (pageOptionsDto: PageOptionsDto, alias?: string) {
    alias = alias ? `${alias}.` : "";
    return this.orderBy(`${alias}${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        .offset((pageOptionsDto.pageNumber - 1) * pageOptionsDto.pageSize)
        .limit(pageOptionsDto.pageSize);
};
