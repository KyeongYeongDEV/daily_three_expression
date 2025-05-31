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
    await this.redisClient.set(key, code, 'EX', 60 * 2); // 2분
  }

  async getEmailVerificationCode(email: string): Promise<string | null> {
    const key = `verify:${email}`;
    return await this.redisClient.get(key);
  }

  async deleteEmailVerificationCode(email: string): Promise<void> {
    const key = `verify:${email}`;
    await this.redisClient.del(key);
  }

  async saveVerifiedEmail(email: string): Promise<void> {
    const key = `isVerifiedEmail:${email}`;
    await this.redisClient.set(key, 'true', 'EX', 60 * 30); // 30분 유효
  }

  async isVerifiedEmail(email: string): Promise<boolean> {
    const key = `isVerifiedEmail:${email}`;
    console.log(`인증된 이메일인지 확인 : ${email} : `, key);
    return await this.redisClient.get(key) === 'true';
  }

  async deleteVerifiedEmail(email: string): Promise<void> {
    const key = `isVerifiedEmail:${email}`;
    console.log(`인증된 이메일 삭제 : ${email} : `, key);
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