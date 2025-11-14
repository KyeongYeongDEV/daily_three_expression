import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

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

import { ConfigModule } from './common/config/config.module';
import { BullMqConfig } from './common/config/redis.config';

import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { TestUserEntity } from './user/domain/test-user.entity';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { MailerModule } from './mailer/mailer.module';

const dynamicImports = [
  NestConfigModule.forRoot({ isGlobal: true }),
  ConfigModule, 

  JwtModule.registerAsync({
    imports: [NestConfigModule], 
    inject: [ConfigService],
    useFactory: jwtConfig,
  }),
  TypeOrmModule.forRootAsync({
    imports: [NestConfigModule], 
    inject: [ConfigService],
    useFactory: postgreConfig,
  }),
  TypeOrmModule.forFeature([
    ExpressionEntity,
    UserEntity,
    ExpressionDeliveryEntity,
    TestUserEntity,
  ]),

  BullModule.forRootAsync(BullMqConfig),

  UserModule,
  AiModule,
  ExpressionModule,
  AuthModule,
  MetricsModule,
  MailerModule,
];

if (process.env.RUN_MODE !== 'WORKER') {
  console.log(
    '[AppModule] RUN_MODE is not WORKER. Loading ScheduleModule and BatchModule.',
  );
  dynamicImports.push(ScheduleModule.forRoot());
  dynamicImports.push(BatchModule);
} else {
  console.log(
    '[AppModule] RUN_MODE is WORKER. Skipping ScheduleModule and BatchModule.',
  );
}

@Module({
  imports: dynamicImports,
  providers: [],
  controllers: [AppController],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MetricsMiddleware)
      .exclude({ path: 'metrics', method: RequestMethod.GET })
      .forRoutes('*');
  }
}