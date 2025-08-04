import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerAdapter } from './adapter/out/mailer.adapter';
import { EmailProcessor } from './processors/email.processor';
import { ConfigModule } from '@nestjs/config'; 
import { ExpressionModule } from 'src/expression/expression.module';
import { UserModule } from 'src/user/user.module';
import { ExpressionAdapter } from 'src/expression/adapter/out/expression.adapter';
import { ExpressionDeliveryAdapter } from 'src/expression/adapter/out/expression-delivery.adapter';
import { UserAdapter } from 'src/user/adpater/out/user.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/domain/user.entity';
import { TestController } from './adapter/in/test.controller';
import { CommonModule } from 'src/common/commom.module';

@Module({
  imports: [
    ConfigModule, 
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
      limiter: {
        max: 1000,         // 초당 최대 1000개 작업만 추가
        duration: 1000,    // 1초 단위
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 2,
      },
    }),
    ExpressionModule, 
    UserModule,   
    TypeOrmModule.forFeature([UserEntity]),   
  ],
  providers: [
    MailerAdapter, 
    EmailProcessor,
    {
      provide: 'ExpressionPort',
      useExisting: ExpressionAdapter,
    },
    {
      provide: 'ExpressionDeliveryPort',
      useExisting: ExpressionDeliveryAdapter,
    },
    {
      provide: 'UserPort',
      useClass: UserAdapter,
    },
  ],
  exports: [MailerAdapter],
  controllers: [
    TestController,
  ],
})
export class MailerModule {}