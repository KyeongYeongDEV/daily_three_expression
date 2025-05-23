import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisPort } from "src/auth/port/out/redis.port";

@Injectable()
export class RedisAdapter implements RedisPort {
  constructor(
    private readonly redisClient : Redis,
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

}