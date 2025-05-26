import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchMailService } from './service/batch.service';
import { MailerAdapter } from './adapter/out/mailer.adapter';
import { BatchMailScheduler } from './scheduler/batch.scheduler';
import { UserEntity } from 'src/user/domain/user.entity';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';
import { TypeOrmExpressionAdapter } from 'src/expression/adapter/out/expression.adapter';
import { TypeOrmUserAdapter } from 'src/user/adpater/out/typeorm-user.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ExpressionEntity])],
  providers: [
    BatchMailService, 
    MailerAdapter,
    BatchMailScheduler, 
    {
      provide: 'ExpressionPort',
      useClass: TypeOrmExpressionAdapter,
    },
    {
      provide: 'UserPort',
      useClass: TypeOrmUserAdapter,
    },
    {
      provide: 'SendMailPort',
      useClass: MailerAdapter,
    },
  ],
})
export class BatchModule {}
