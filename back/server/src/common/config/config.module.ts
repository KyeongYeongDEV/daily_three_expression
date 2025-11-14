import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import {
  RedisWriteClientProvider,
  RedisReadClientProvider,
} from './redis.config';

@Global() 
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [RedisWriteClientProvider, RedisReadClientProvider],

  exports: [RedisWriteClientProvider, RedisReadClientProvider],
})
export class ConfigModule {}