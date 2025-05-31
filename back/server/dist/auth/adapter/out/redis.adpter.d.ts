import Redis from "ioredis";
import { RedisPort } from "src/auth/port/out/redis.port";
export declare class RedisAdapter implements RedisPort {
    private readonly redisClient;
    constructor(redisClient: Redis);
    saveEmailVerificationCode(email: string, code: string): Promise<void>;
    getEmailVerificationCode(email: string): Promise<string | null>;
    deleteEmailVerificationCode(email: string): Promise<void>;
    saveVerifiedEmail(email: string): Promise<void>;
    isVerifiedEmail(email: string): Promise<boolean>;
    deleteVerifiedEmail(email: string): Promise<void>;
    saveRefreshToken(email: string, refreshToken: string): Promise<void>;
    getRefreshToken(email: string): Promise<string | null>;
    deleteRefreshToken(email: string): Promise<void>;
}
