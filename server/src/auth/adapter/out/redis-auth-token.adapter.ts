import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AuthTokenPort } from '../../port/out/auth-token.port';

@Injectable()
export class RedisAuthTokenAdapter implements AuthTokenPort {
  constructor(private readonly redis: Redis) {}

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    await this.redis.set(`refresh:${userId}`, token, 'EX', 60 * 60 * 24 * 7);
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    return await this.redis.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }
}