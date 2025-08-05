import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchMailService } from './service/batch.service';
import { MailerAdapter } from '../mailer/adapter/out/mailer.adapter';
import { BatchMailScheduler } from './scheduler/batch.scheduler';
import { UserEntity } from '../user/domain/user.entity';
import { ExpressionEntity } from '../expression/domain/expression.entity';
import { ExpressionAdapter } from '../expression/adapter/out/expression.adapter';
import { UserAdapter } from '../user/adpater/out/user.adapter';
import { AiModule } from '../ai/ai.module';
import { ExpressionModule } from '../expression/expression.module';
import { ExpressionDeliveryAdapter } from '../expression/adapter/out/expression-delivery.adapter';
import { MailerModule } from '../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ExpressionEntity]),
    AiModule,
    MailerModule,
    AuthModule,
    forwardRef(() => ExpressionModule), 
  ],
  providers: [
    BatchMailService, 
    BatchMailScheduler, 
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
      provide: 'SendMailPort',
      useExisting: MailerAdapter,
    },
  ],
  exports: [
    {
      provide: 'SendMailPort',
      useExisting: MailerAdapter,
    },
  ]
})
export class BatchModule {}
