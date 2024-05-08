import { LRUCache } from "lru-cache";
import { Tokens } from "../../entities/Tokens";
import { appDataSource } from "../../config/Database";
import { type Repository } from "typeorm";
import * as jwt from "jsonwebtoken";
import { Md5 } from "ts-md5";
import ReadWriteLock from "rwlock";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP, RESET_TOKEN_EXP } from "../constants";

type TokenCategory = "USER" | "REFRESH" | "RESET_PSWD";

class HashedString extends String {}

export class TokensRepository {
    private readonly invalidCacheWildCard: LRUCache<string, Date>;
    private readonly invalidCache: LRUCache<string, Set<HashedString>>;
    private readonly validCache: LRUCache<string, Map<HashedString, Date>>;
    private readonly repository: Repository<Tokens>;
    private readonly lock: ReadWriteLock;

    public constructor(
        private readonly tokenCategory: TokenCategory,
        private readonly tokenExpiration: number,
        max: number = 500,
        ttl = 1000 * 60 * 60 * 3
    ) {
        const options = { max, ttl };
        this.repository = appDataSource.getRepository(Tokens);
        this.invalidCacheWildCard = new LRUCache<string, Date>(options);
        this.invalidCache = new LRUCache<string, Set<HashedString>>(options);
        this.validCache = new LRUCache<string, Map<HashedString, Date>>(options);
        this.lock = new ReadWriteLock();
    }

    public readonly blacklist = async (elementId: string, token: string, expiration: Date) => {
        const tokenHash = TokensRepository._hashToken(token);
        this.lock.writeLock(elementId, async (release: ReadWriteLock.Release) => {
            try {
                this._blacklist(elementId, tokenHash, expiration);
            } finally {
                release();
            }
        });
    };

    public readonly blacklistAll = async (elementId: string) => {
        // when would the last expired token exire at worst case. new tokens will have an expiration higher than maxExpiration.
        const maxExpiration = this._getEstimatedExpiration();
        this.lock.writeLock(elementId, async (release: ReadWriteLock.Release) => {
            try {
                const response = await this.repository.save({
                    token: this.tokenCategory,
                    elementId,
                    expiration: maxExpiration,
                });
                this.invalidCacheWildCard.set(elementId, maxExpiration);
            } finally {
                release();
            }
        });
    };

    public readonly checkValidity = async (token: string, elementId: string, expiration: Date): Promise<void> => {
        if (!(await this.isValid(token, elementId, expiration))) {
            throw new jwt.JsonWebTokenError("Invalid or expired token.");
        }
    };

    public readonly isValid = async (token: string, elementId: string, expiration: Date): Promise<boolean> => {
        const tokenHash = TokensRepository._hashToken(token);
        return new Promise<boolean>((resolve) => {
            this.lock.readLock(elementId, async (release: ReadWriteLock.Release) => {
                try {
                    // 1- Check for valid cache.
                    if (this._isWhitelisted(elementId, tokenHash)) {
                        resolve(true);
                    }
                    // 2- check for blacklist.
                    if (await this._isBlacklisted(elementId, tokenHash, expiration)) {
                        resolve(false);
                    }
                    // 3- if not invalid then add to valid cache.
                    this._addToValidCachelist(elementId, tokenHash, expiration);
                    resolve(true);
                } finally {
                    release();
                }
            });
        });
    };

    private readonly _blacklist = async (elementId: string, tokenHash: HashedString, expiration: Date) => {
        this._removeFromWhitelistIfExists(elementId, tokenHash);
        this._addToInvalidCachelist(elementId, tokenHash);
        await this._persistInDB(elementId, tokenHash, expiration);
    };

    private readonly _checkWildCardExistsInCache = (elementId: string, expiration: Date) => {
        const cachedWildcardValue = this.invalidCacheWildCard.get(elementId);
        return cachedWildcardValue && expiration.getTime() < cachedWildcardValue.getTime();
    };

    private readonly _persistInDB = async (elementId: string, tokenHash: HashedString, expiration: Date) => {
        try {
            await this.repository.insert({
                token: tokenHash as string,
                elementId,
                expiration,
            });
        } catch (error: any) {
            if (error.code !== "ER_DUP_ENTRY") {
                throw error; // propagate error
            }
        }
    };

    private readonly _isBlacklisted = async (elementId: string, tokenHash: HashedString, expiration: Date) => {
        // check for wildcard in cache
        if (this._checkWildCardExistsInCache(elementId, expiration)) {
            return true;
        }
        // check for token in cache
        const elementCache = this.invalidCache.get(elementId);
        if (elementCache != undefined && elementCache.has(tokenHash)) {
            return true;
        }
        // check for wildcard in DB:
        const wildCardInDb = await this.repository.findOne({
            where: {
                token: this.tokenCategory,
                elementId,
            },
        });
        if (wildCardInDb && expiration < wildCardInDb.expiration) {
            this.invalidCacheWildCard.set(elementId, expiration);
            return true;
        }
        // check for token in DB
        const tokenInDb = await this.repository.findOne({
            where: {
                token: tokenHash as string,
                elementId,
            },
        });
        if (tokenInDb) {
            this._addToInvalidCachelist(elementId, tokenHash);
            return true;
        }
        return false;
    };

    private readonly _isWhitelisted = (elementId: string, tokenHash: HashedString): boolean => {
        const elementCache = this.validCache.get(elementId);
        if (elementCache != undefined) {
            const expiration = elementCache.get(tokenHash);
            if (expiration != undefined) {
                if (Date.now() <= expiration.getTime()) {
                    return true;
                } else {
                    elementCache.delete(tokenHash);
                }
            }
        }
        return false;
    };

    private readonly _removeFromWhitelistIfExists = (elementId: string, tokenHash: HashedString): boolean => {
        const elementCache = this.validCache.get(elementId);
        if (elementCache) {
            elementCache.delete(tokenHash);
            this.validCache.set(elementId, elementCache);
            return true;
        }
        return false;
    };

    private readonly _addToInvalidCachelist = (elementId: string, tokenHash: HashedString) => {
        const elementCache = this.invalidCache.get(elementId);
        if (elementCache) {
            elementCache.add(tokenHash);
            this.invalidCache.set(elementId, elementCache);
        } else {
            let tokensSet: Set<HashedString> = new Set<string>();
            tokensSet.add(tokenHash);
            this.invalidCache.set(elementId, tokensSet);
        }
    };

    private readonly _addToValidCachelist = (elementId: string, tokenHash: HashedString, expiration: Date) => {
        const elementCache = this.validCache.get(elementId);
        if (elementCache) {
            elementCache.set(tokenHash, expiration);
            this.validCache.set(elementId, elementCache);
        } else {
            let tokensSet: Map<HashedString, Date> = new Map<string, Date>();
            tokensSet.set(tokenHash, expiration);
            this.validCache.set(elementId, tokensSet);
        }
    };

    private static readonly _hashToken = (token: string) => Md5.hashStr(token) as HashedString;
    private readonly _getEstimatedExpiration = () => new Date(Date.now() + this.tokenExpiration);
}

export const AccessTokenRepo: TokensRepository = new TokensRepository("USER", ACCESS_TOKEN_EXP, 600);
export const RefreshTokenRepo: TokensRepository = new TokensRepository("REFRESH", REFRESH_TOKEN_EXP, 50);
export const ResetPswdTokenRepo: TokensRepository = new TokensRepository("RESET_PSWD", RESET_TOKEN_EXP, 10);
