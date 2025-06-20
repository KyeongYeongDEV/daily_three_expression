import { Test } from '@nestjs/testing';
import { MailerAdapter } from '../../adapter/out/mailer.adapter';   
import { MailerTestModule } from '../../mailer-test.module';

describe('MailerAdapter', () => {
  let mailerAdapter: MailerAdapter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MailerTestModule],
    }).compile();

    mailerAdapter = moduleRef.get(MailerAdapter);
  });

  it('should enqueue sendVerification job', async () => {
    const result = await mailerAdapter.sendEmailVerificationCode('test@example.com', '123456');
    expect(result).toBe(true);
  });

  it('should enqueue sendExpression job', async () => {
    await mailerAdapter.sendExpression(); // 내부에서 큐에 job만 추가함
  });
});
