import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisConfig: Provider = {
  provide: 'REDIS',
  useFactory: () => {
    return new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  },
};
