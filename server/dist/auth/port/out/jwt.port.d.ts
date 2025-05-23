export interface JwtPort {
    signAccessToken(payload: any): Promise<string>;
    signRefreshToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
    decodeToken(token: string): Promise<any>;
}
