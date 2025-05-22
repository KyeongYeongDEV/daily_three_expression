import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { AuthTokenPort } from "src/auth/port/out/auth-token.port";

@Injectable()
export class RedisJwtAuthAdapter implements AuthTokenPort {
  constructor(
    private readonly jwtService : JwtService,
    private readonly redisClient : Redis
  ){}

  async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.redisClient.set(`refresh:${email}`, refreshToken, 'EX', 60 * 60 * 24 * 7) //7일
  }
  async getRefreshToken(email: string): Promise<string | null> {
    return this.redisClient.get(`refresh:${email}`);
  }

  async deleteRefreshToken(email: string): Promise<void> {
    await this.redisClient.del(`refresh:${email}`);
  }

  async signAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async signRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
  
}