import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisPort } from '../../../auth/port/out/redis.port';

@Injectable()
export class RedisAdapter implements RedisPort {
  constructor(
    @Inject('REDIS_WRITE') private readonly redisWriteClient: Redis, // 마스터  (쓰기)
    @Inject('REDIS_READ') private readonly redisReadClient: Redis, // 슬레이브 (읽기)
  ) {}

  async saveEmailVerificationCode(email: string, code: string): Promise<void> {
    const key = `verify:${email}`;
    await this.redisWriteClient.set(key, code, 'EX', 60 * 2); // 2분
  }

  async deleteEmailVerificationCode(email: string): Promise<void> {
    const key = `verify:${email}`;
    await this.redisWriteClient.del(key);
  }

  async saveVerifiedEmail(email: string): Promise<void> {
    const key = `isVerifiedEmail:${email}`;
    await this.redisWriteClient.set(key, 'true', 'EX', 60); // 1분 유효
  }

  async deleteVerifiedEmail(email: string): Promise<void> {
    const key = `isVerifiedEmail:${email}`;
    console.log(`인증된 이메일 삭제 : ${email} : `, key);
    await this.redisWriteClient.del(key);
  }

  async saveRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.redisWriteClient.set(
      `refresh:${email}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    ); //7일
  }

  async deleteRefreshToken(email: string): Promise<void> {
    await this.redisWriteClient.del(`refresh:${email}`);
  }

  async saveUuidToken(email: string, UuidToken: string): Promise<void> {
    await this.redisWriteClient.set(
      `uuid:${email}`,
      UuidToken,
      'EX',
      60 * 60 * 24,
    ); // 24시간 동안 유효
  }

  async deleteUuidToken(email: string): Promise<void> {
    await this.redisWriteClient.del(`uuid:${email}`);
  }

  async getEmailVerificationCode(email: string): Promise<string | null> {
    const key = `verify:${email}`;
    return await this.redisReadClient.get(key);
  }

  async isVerifiedEmail(email: string): Promise<boolean> {
    const key = `isVerifiedEmail:${email}`;
    console.log(`인증된 이메일인지 확인 : ${email} : `, key);
    return (await this.redisReadClient.get(key)) === 'true';
  }

  async getRefreshToken(email: string): Promise<string | null> {
    return this.redisReadClient.get(`refresh:${email}`);
  }

  async getUuidToken(email: string): Promise<string | null> {
    return this.redisReadClient.get(`uuid:${email}`);
  }
}