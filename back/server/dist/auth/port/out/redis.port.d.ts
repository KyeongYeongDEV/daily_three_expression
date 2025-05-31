export interface RedisPort {
    saveRefreshToken(email: string, refreshToken: string): Promise<void>;
    getRefreshToken(email: string): Promise<string | null>;
    deleteRefreshToken(email: string): Promise<void>;
    saveEmailVerificationCode(email: string, code: string): Promise<void>;
    getEmailVerificationCode(email: string): Promise<string | null>;
    deleteEmailVerificationCode(email: string): Promise<void>;
}
