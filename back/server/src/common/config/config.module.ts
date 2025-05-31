import { Module } from '@nestjs/common';
import { RedisConfig } from './redis.config';

@Module({
  providers: [RedisConfig],
  exports: ['REDIS'], 
})
export class RedisConfigModule {}
