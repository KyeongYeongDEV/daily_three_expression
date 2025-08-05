import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailerAdapter } from './adapter/out/mailer.adapter';
import { EmailProcessor } from './processors/email.processor';
import { ConfigModule } from '@nestjs/config'; 
import { ExpressionModule } from '../expression/expression.module';
import { UserModule } from '../user/user.module';
import { ExpressionAdapter } from '../expression/adapter/out/expression.adapter';
import { ExpressionDeliveryAdapter } from '../expression/adapter/out/expression-delivery.adapter';
import { UserAdapter } from '../user/adpater/out/user.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/domain/user.entity';
import { TestController } from './adapter/in/test.controller';
import { CommonModule } from '../common/commom.module';

@Module({
  imports: [
    ConfigModule, 
    CommonModule,
    BullModule.registerQueue({
      name: 'email',
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