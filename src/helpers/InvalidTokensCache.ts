import { LRUCache } from "lru-cache";
import { InvalidTokens } from "../entities/InvalidTokens";
import { appDataSource } from "../config/Database";
import { type Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import ms from "ms";

const options = {
    // number of items at max is 500
    max: 500,

    // how long to live in ms before deletion (3 hours)
    ttl: 1000 * 60 * 60 * 3,
};

export class InvalidTokensCache {
    private readonly cache = new LRUCache(options);
    // TODO: add valid tokens cache for optimization
    private readonly repository: Repository<InvalidTokens>;
    private readonly TOKEN_LEN = 40;

    constructor() {
        this.repository = appDataSource.getRepository(InvalidTokens);
    }

    public readonly invalidate = async (token: string, elementId: string, expiration: Date) => {
        try {
            await this.repository.insert({
                token: token.substring(0, this.TOKEN_LEN),
                elementId,
                expiration,
            });
        } catch (error: any) {
            if (error.code !== "ER_DUP_ENTRY") {
                throw error; // propagate error
            }
        }
    };

    public readonly invalidateAllUserTokens = async (elementId: string) => {
        const maxExpiration = new Date(Date.now() + ms(process.env.JWT_EXP_IN!));
        return await this.repository.save({
            token: "*",
            elementId,
            expiration: maxExpiration,
        });
    };

    public readonly isValid = async (token: string, elementId: string, expiration: Date): Promise<boolean> => {
        const cacheKey = token.substring(0, this.TOKEN_LEN) + elementId;
        const wildcardKey = elementId + "**";
        const cachedWildcardValue = this.cache.get(wildcardKey);

        // check cache
        if (cachedWildcardValue && expiration.getTime() < (cachedWildcardValue as number)) {
            return false;
        }
        if (this.cache.get(cacheKey) === ".") {
            return false;
        }

        // cache miss. search repository
        if (await this.isTokenInDB(token, elementId)) {
            this.cache.set(cacheKey, ".");
            return false;
        }
        const wildCardInDB = await this.isWildcardInDB(elementId);
        if (wildCardInDB) {
            const wildcardDate = wildCardInDB.expiration.getTime() / 1000;
            this.cache.set(wildcardKey, wildcardDate);
            return false;
        }

        // token not found anywhere -> valid
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
                token: token.substring(0, this.TOKEN_LEN),
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
