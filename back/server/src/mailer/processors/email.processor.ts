import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { ExpressionDeliveryPort } from '../../expression/port/expression-delivery.port';
import { WebhookService } from '../../common/service/webhook.service';

@Processor('email', { concurrency: 20 })
export class EmailProcessor extends WorkerHost {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService : WebhookService,
    @Inject('ExpressionDeliveryPort') 
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {
    super(); 
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      pool: true, 
      maxConnections: 5,
      maxMessages: 100, 
      rateLimit: 5
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    // 잡 이름(job.name)에 따라 로직을 분기합니다.
    switch (job.name) {
      case 'send-verification':
        return this.handleSendVerificationEmail(job);

      case 'send-expression':
        return this.handleSendExpressionEmail(job);

      default:
        console.warn(`[EMAIL PROCESSOR] 알 수 없는 잡 이름입니다: ${job.name}`);
    }
  }

  private buildEmailFailureMessage( job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>, error: unknown ) : string {
    const { to, u_id, deliveredId } = job.data;
    const errorMsg = error instanceof Error ? error.message : String(error);
  
    return `
    ❌ **이메일 전송 실패 알림**
    - 대상: ${to}
    - 유저 ID: ${u_id}
    - 표현 ID: ${deliveredId}
    - 에러: \`${errorMsg}\`
    - 시도 횟수: ${job.attemptsMade + 1}/${job.opts.attempts}
      `.trim();
  }
  
  private async handleSendVerificationEmail(job: Job<{ to: string; html: string }>) {
    try {
      const { to, html } = job.data;
      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 이메일 인증 코드입니다.',
        html,
      });
      console.log(`[이메일 인증 전송 프로세스] ✅ 인증 코드 메일 전송 완료:`, info.messageId);
    } catch (error) {
      console.error(`[이메일 인증 전송 프로세스] ❌ 인증 코드 메일 전송 실패:`, error);
      // BullMQ가 재시도하도록 에러를 다시 던집니다.
      throw new Error(`인증 메일 SMTP 전송 실패: ${error?.message ?? error}`);
    }
  } 

  // private 헬퍼 메서드로 변경
  private async handleSendExpressionEmail(job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>) {
    const { to, html, u_id, deliveredId } = job.data;
    try {
      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 오늘의 표현 3개입니다 :)',
        html,
      });

      console.log(`[표현 전송 프로세스] ✅ 표현 이메일 전송 완료 → ${to}:`, info.messageId);
      await this.expressionDeliveryPort.saveExpressionDeliveried(u_id, deliveredId, 'success');
    } catch (error) {
      console.error(`[표현 전송 프로세스] ❌ 표현 이메일 전송 실패 → ${to}:`, error);

      const errorMessage = this.buildEmailFailureMessage(job, error);
      await this.webhookService.sendMessage(errorMessage);

      throw new Error(`SMTP 전송 실패: ${error?.message ?? error}`);
    }
  }
}