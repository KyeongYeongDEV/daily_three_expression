import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AIModule } from './ai/ai.module';
import { BatchModule } from './batch/batch.module';
import { SendModule } from './send/send.module';
import { Expression } from './ai/entitys/expression.entity';
import { User } from './user/entitys/user.entity';
import { UserExpressionProgress } from './user-expression-progress/entitys/user-expression-progress.entity';
import { UserExpressionService } from './user-expression-progress/user-expression-progress.service';
import { UserExpressionProgressModule } from './user-expression-progress/user-expression-progress.module';

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
    UserExpressionProgressModule,
  ],
  providers: [UserExpressionService],
})
export class AppModule {}
