import { LRUCache } from "lru-cache";
import { InvalidTokens } from "../entities/InvalidTokens";
import { appDataSource } from "../config/Database";
import { type Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import ms from "ms";
import { Md5 } from "ts-md5";

const options = {
    // number of items at max is 500
    max: 500,

    // how long to live in ms before deletion (3 hours)
    ttl: 1000 * 60 * 60 * 3,
};

export class InvalidTokensCache {
    private readonly invalidCache = new LRUCache(options);
    private readonly validCache = new LRUCache(options);
    private readonly repository: Repository<InvalidTokens>;

    constructor() {
        this.repository = appDataSource.getRepository(InvalidTokens);
    }

    public readonly invalidate = async (token: string, elementId: string, expiration: Date) => {
        try {
            // remove from valid keys cache
            const cacheKey = this.genCacheKey(token, elementId);
            this.validCache.delete(cacheKey);
            await this.repository.insert({
                token: Md5.hashStr(token),
                elementId,
                expiration,
            });
            this.invalidCache.set(cacheKey, ".");
        } catch (error: any) {
            if (error.code !== "ER_DUP_ENTRY") {
                throw error; // propagate error
            }
        }
    };

    public readonly invalidateAllUserTokens = async (elementId: string) => {
        const maxExpiration = new Date(Date.now() + ms(process.env.JWT_EXP_IN!));
        // FIXME: Is there a better option than deleting all cache or identifying all
        // elementId by forEach then deleting them ?
        this.validCache.clear();
        return await this.repository.save({
            token: "*",
            elementId,
            expiration: maxExpiration,
        });
        // add to invalid cache ?
    };

    readonly genCacheKey = (token: string, elementId: string) => Md5.hashStr(token) + elementId;

    public readonly isValid = async (token: string, elementId: string, expiration: Date): Promise<boolean> => {
        const cacheKey = this.genCacheKey(token, elementId);
        const wildcardKey = elementId + "**";
        const cachedWildcardValue = this.invalidCache.get(wildcardKey);

        // check cache
        if (this.validCache.get(cacheKey) === ".") {
            return true;
        }

        if (cachedWildcardValue && expiration.getTime() < (cachedWildcardValue as number)) {
            return false;
        }
        if (this.invalidCache.get(cacheKey) === ".") {
            return false;
        }

        // cache miss. search repository
        if (await this.isTokenInDB(token, elementId)) {
            this.invalidCache.set(cacheKey, ".");
            return false;
        }
        const wildCardInDB = await this.isWildcardInDB(elementId);
        if (wildCardInDB && expiration < wildCardInDB.expiration) {
            const wildcardDate = wildCardInDB.expiration.getTime() / 1000;
            this.invalidCache.set(wildcardKey, wildcardDate);
            return false;
        }

        // token not found anywhere -> valid
        this.validCache.set(cacheKey, ".");
        return true;
    };

    public readonly checkValidity = async (token: string, elementId: string, expiration: Date): Promise<void> => {
        if (!(await this.isValid(token, elementId, expiration))) {
            throw new jwt.JsonWebTokenError("Invalid token.");
        }
    };

    private readonly isTokenInDB = async (token: string, elementId: string) => {
        return await this.repository.findOne({
            where: {
                token: Md5.hashStr(token),
                elementId,
            },
        });
    };

    private readonly isWildcardInDB = async (elementId: string) => {
        return await this.repository.findOne({
            where: {
                token: "*",
                elementId,
            },
        });
    };
}

export const invalidTokensCache = new InvalidTokensCache();
