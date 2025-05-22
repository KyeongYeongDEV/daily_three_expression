export interface AuthTokenPort {
  saveRefreshToken(email: string, refreshToken: string): Promise<void>;
  getRefreshToken(email: string): Promise<string | null>;
  deleteRefreshToken(email: string): Promise<void>;
  signAccessToken(payload: any): Promise<string>;
  signRefreshToken(payload: any): Promise<string>;
  verifyToken(token: string): Promise<any>;
  decodeToken(token: string): Promise<any>;
}
