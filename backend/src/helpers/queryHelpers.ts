import { PageOptionsDto } from "../DTOs/paging/pageOptionsDto";
import { FindOptionsWhere, Repository, SelectQueryBuilder } from "typeorm";
import { AbstractEntity } from "../entities/abstractEntity";
import { AppErrors } from "./appErrors";

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

// Declare the Extension
declare module "typeorm" {
    interface SelectQueryBuilder<Entity> {
        addPaging(pageOptionsDto: PageOptionsDto, alias?: string): this;
        leftJoinAndSelectIfNeeded(relation: string, alias: string, shouldJoin: boolean): this;
    }
}

SelectQueryBuilder.prototype.addPaging = function (pageOptionsDto: PageOptionsDto, alias?: string) {
    alias = alias ? `${alias}.` : "";
    return this.orderBy(`${alias}${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        .offset((pageOptionsDto.pageNumber - 1) * pageOptionsDto.pageSize)
        .limit(pageOptionsDto.pageSize);
};

SelectQueryBuilder.prototype.leftJoinAndSelectIfNeeded = function (
    relation: string,
    alias: string,
    shouldJoin: boolean
) {
    if (shouldJoin) {
        return this.leftJoinAndSelect(relation, alias);
    }
    return this;
};

export async function getOrThrow<Entity extends AbstractEntity>(
    id: string,
    repository: Repository<Entity>,
    alias: string | null = null,
    bringDeleted: boolean = false,
    relations: string[] = []
): Promise<Entity> {
    const whereClause = {
        id: id,
        isDeleted: bringDeleted ? undefined : false,
    } as FindOptionsWhere<Entity>;

    const elem = await repository.findOne({ where: whereClause, relations: relations });
    if (!elem) {
        throw new AppErrors.NotFound(`Unable to find ${alias ?? "element"} with id : '${id}'.`);
    }
    return elem;
}
