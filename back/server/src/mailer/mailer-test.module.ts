import { Module } from '@nestjs/common';
import { MailerAdapter } from '../mailer/adapter/out/mailer.adapter';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { MockEmailProcessor } from '../mailer/processors/mock-email.processor'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    MailerAdapter,
    MockEmailProcessor,
    { provide: 'ExpressionPort', useValue: { findThreeExpressionsByStartId: jest.fn() } },
    { provide: 'ExpressionDeliveryPort', useValue: { findStartExpressionId: jest.fn() } },
    { provide: 'UserPort', useValue: { findAllUsersEmail: jest.fn() } },
  ],
  exports: [MailerAdapter],
})
export class MailerTestModule {}
