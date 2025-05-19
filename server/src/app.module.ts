import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AIModule } from './ai/ai.module';
import { BatchModule } from './batch/batch.module';
import { SendModule } from './send/send.module';
import { ExpressionModule } from './expression/expression.module';

import { ExpressionEntity } from './expression/entities/expression.entity';
import { User } from './user/entities/user.entity';
import { ExpressionDeliveryEntity } from './expression/entities/expression-delivery.entity';
import { typeOrmConfig } from './common/config/mysql.config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([
      ExpressionEntity,
      User,
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
    UserModule,
    AdminModule,
    AIModule,
    BatchModule,
    SendModule,
    ExpressionModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
