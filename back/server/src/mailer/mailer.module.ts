import { forwardRef, Module } from '@nestjs/common';
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
import { CommonModule } from '../common/commom.module';
import { BatchModule } from '../batch/batch.module';

import { TestUserEntity } from '../user/domain/test-user.entity';
import { TestController } from './adapter/in/test.controller';
import { TestUserQueryAdapter } from '../user/adpater/out/test-user.adapter';
import { BlockingMailerService } from './service/blocking-mailer.service';

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
    TypeOrmModule.forFeature([TestUserEntity]),
    forwardRef(() => BatchModule),
  ],
  providers: [
    MailerAdapter, 
    EmailProcessor,
    BlockingMailerService,
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
    {
      provide: 'TestUserPort',
      useClass: TestUserQueryAdapter,
    },
  ],
  exports: [MailerAdapter],
  controllers: [
    TestController,
  ],
})
export class MailerModule {}