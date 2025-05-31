import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisPort } from "src/auth/port/out/redis.port";

@Injectable()
export class RedisAdapter implements RedisPort {
  constructor(
    @Inject('REDIS')
    private readonly redisClient : Redis,
  ){}

  async saveEmailVerificationCode(email: string, code : string): Promise<void> {
    const key = `verify:${email}`;
    await this.redisClient.set(key, code, 'EX', 60); // 1분

  }

  async getEmailVerificationCode(email: string): Promise<string | null> {
    const key = `verify:${email}`;
    return await this.redisClient.get(key);
  }

  async deleteEmailVerificationCode(email: string): Promise<void> {
    const key = `verify:${email}`;
    await this.redisClient.del(key);
  }
  
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