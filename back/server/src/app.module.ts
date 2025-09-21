import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { MetricsModule } from './metrics/metrics.module';


import { ExpressionEntity } from './expression/domain/expression.entity';
import { UserEntity } from './user/domain/user.entity';
import { ExpressionDeliveryEntity } from './expression/domain/expression-delivery.entity';

import { postgreConfig } from './common/config/postgre.config';
import { jwtConfig } from './common/config/jwt.config';
import { RedisConfig } from './common/config/redis.config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { TestUserEntity } from './user/domain/test-user.entity';
import { MetricsMiddleware } from './metrics/metrics.middleware';

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
      useFactory: postgreConfig,
    }),
    TypeOrmModule.forFeature([
      ExpressionEntity,
      UserEntity,
      ExpressionDeliveryEntity,
      TestUserEntity,
    ]),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: { 
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
    MetricsModule,
  ],
  providers: [RedisConfig],
  controllers: [AppController],
  exports : ['REDIS']
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .exclude({ path: 'metrics', method: RequestMethod.GET }) // 제외 조건
      .forRoutes('*'); // 전체 라우트에 적용
  }
}
