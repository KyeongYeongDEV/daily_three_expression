import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchMailService } from './service/batch.service';
import { MailerAdapter } from '../mailer/adapter/out/mailer.adapter';
import { BatchMailScheduler } from './scheduler/batch.scheduler';
import { UserEntity } from 'src/user/domain/user.entity';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';
import { ExpressionAdapter } from 'src/expression/adapter/out/expression.adapter';
import { UserAdapter } from 'src/user/adpater/out/user.adapter';
import { AiModule } from 'src/ai/ai.module';
import { ExpressionModule } from 'src/expression/expression.module';
import { ExpressionDeliveryAdapter } from 'src/expression/adapter/out/expression-delivery.adapter';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthService } from 'src/auth/service/auth.service';
import { AuthModule } from 'src/auth/auth.module';

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
