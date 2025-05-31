export interface RedisPort {
    saveRefreshToken(email: string, refreshToken: string): Promise<void>;
    getRefreshToken(email: string): Promise<string | null>;
    deleteRefreshToken(email: string): Promise<void>;
}
