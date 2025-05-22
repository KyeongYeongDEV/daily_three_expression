import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AIModule } from './ai/ai.module';
import { BatchModule } from './batch/batch.module';
import { ExpressionModule } from './expression/expression.module';
import { MailerModule } from './mailer/mailer.module';

import { ExpressionEntity } from './expression/domain/expression.entity';
import { UserEntity } from './user/domain/user.entity';
import { ExpressionDeliveryEntity } from './expression/domain/expression-delivery.entity';
import { typeOrmConfig } from './common/config/mysql.config';
import { AuthModule } from './auth/auth.module';


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
    UserModule,
    AdminModule,
    AIModule,
    BatchModule,
    MailerModule,
    ExpressionModule,
    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
