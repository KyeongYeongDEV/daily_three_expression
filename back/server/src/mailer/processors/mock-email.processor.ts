import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class MockEmailProcessor extends WorkerHost {

  async process(job: Job<any, any, string>): Promise<any> {
    // 잡 이름(job.name)에 따라 로직을 분기합니다.
    switch (job.name) {
      case 'send-expression':
        this.handleExpression(job);
        break;

      case 'send-verification':
        this.handleVerification(job);
        break;

      default:
        console.warn(`[MOCK] 알 수 없는 잡 이름입니다: ${job.name}`);
    }
  }

  // 실제 로직은 private 메서드로 관리할 수 있습니다.
  private handleExpression(job: Job): void {
    console.log('[MOCK] 📬 표현 메일 잡 수신됨:', job.data);
  }

  private handleVerification(job: Job): void {
    console.log('[MOCK] 🔐 인증 메일 잡 수신됨:', job.data);
  }
}