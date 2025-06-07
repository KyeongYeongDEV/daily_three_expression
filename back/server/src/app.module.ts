import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AiModule } from './ai/ai.module';
import { BatchModule } from './batch/batch.module';
import { ExpressionModule } from './expression/expression.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { ExpressionEntity } from './expression/domain/expression.entity';
import { UserEntity } from './user/domain/user.entity';
import { ExpressionDeliveryEntity } from './expression/domain/expression-delivery.entity';

import { typeOrmConfig } from './common/config/mysql.config';
import { jwtConfig } from './common/config/jwt.config';
import { RedisConfig } from './common/config/redis.config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([
      ExpressionEntity,
      UserEntity,
      ExpressionDeliveryEntity,
    ]),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        options: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
        },
      }),
    }),
    UserModule,
    AiModule,
    BatchModule,
    ExpressionModule,
    AuthModule,
  ],
  providers: [RedisConfig],
  controllers: [AppController],
  exports : ['REDIS']
})
export class AppModule {}
