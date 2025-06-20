import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class MockEmailProcessor {
  @Process('send-expression')
  async handleExpression(job: Job) {
    console.log('[MOCK] 📬 표현 메일 잡 수신됨:', job.data);
  }

  @Process('send-verification')
  async handleVerification(job: Job) {
    console.log('[MOCK] 🔐 인증 메일 잡 수신됨:', job.data);
  }
}
