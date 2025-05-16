import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AIModule } from './ai/ai.module';
import { BatchModule } from './batch/batch.module';
import { SendModule } from './send/send.module';
import { Expression } from './entitys/expression.entity';
import { User } from './entitys/user.entity';
import { UserExpressionProgress } from './entitys/user-expression-progress.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([
      Expression,
      User,
      UserExpressionProgress,
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
  ],
})
export class AppModule {}
