import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchMailService } from './service/batch.service';
import { MailerAdapter } from './adapter/out/mailer.adapter';
import { BatchMailScheduler } from './scheduler/batch.scheduler';
import { UserEntity } from 'src/user/domain/user.entity';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';
import { ExpressionAdapter } from 'src/expression/adapter/out/expression.adapter';
import { UserAdapter } from 'src/user/adpater/out/user.adapter';
import { AiModule } from 'src/ai/ai.module';
import { ExpressionModule } from 'src/expression/expression.module';
import { ExpressionDeliveryAdapter } from 'src/expression/adapter/out/expression-delivery.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ExpressionEntity]),
    AiModule,
    forwardRef(() => ExpressionModule), 
  ],
  providers: [
    BatchMailService, 
    MailerAdapter,
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
      useClass: MailerAdapter,
    },
  ],
  exports: [
    {
      provide: 'SendMailPort',
      useClass: MailerAdapter,
    },
  ]
})
export class BatchModule {}
