// src/auth/service/auth.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { AuthServicePort } from '../port/in/auth.service.port';
import { AuthTokenPort } from '../port/out/auth-token.port';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject('AuthTokenPort') private readonly tokenPort: AuthTokenPort,
  ) {}

  async validateUser(email: string): Promise<boolean> {
    // 실 서비스에선 유저 존재 여부를 확인해야 함
    return !!email;
  }

  async createToken(email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { email };
    const accessToken = await this.tokenPort.signAccessToken(payload);
    const refreshToken = await this.tokenPort.signRefreshToken(payload);
    await this.tokenPort.saveRefreshToken(email, refreshToken);
    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await this.tokenPort.verifyToken(token);
      return true;
    } catch {
      return false;
    }
  }

  async getEmailFromToken(token: string): Promise<string | null> {
    const decoded = await this.tokenPort.decodeToken(token);
    return decoded?.email ?? null;
  }

  async logout(email: string): Promise<void> {
    await this.tokenPort.deleteRefreshToken(email);
  }
}
