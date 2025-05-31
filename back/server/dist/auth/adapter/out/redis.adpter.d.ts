import Redis from "ioredis";
import { RedisPort } from "src/auth/port/out/redis.port";
export declare class RedisAdapter implements RedisPort {
    private readonly redisClient;
    constructor(redisClient: Redis);
    saveRefreshToken(email: string, refreshToken: string): Promise<void>;
    getRefreshToken(email: string): Promise<string | null>;
    deleteRefreshToken(email: string): Promise<void>;
}
