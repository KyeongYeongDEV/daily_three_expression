export interface AuthServicePort {
  validateUser(email: string): Promise<boolean>;
  createToken(email: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyToken(token: string): Promise<boolean>;
  getEmailFromToken(token: string): Promise<string | null>;
  logout(email: string): Promise<void>;
}
