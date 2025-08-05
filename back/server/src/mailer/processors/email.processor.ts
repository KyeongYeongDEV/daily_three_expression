import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { ExpressionDeliveryPort } from '../../expression/port/expression-delivery.port';
import { WebhookService } from '../../common/service/webhook.service';

@Processor('email')
export class EmailProcessor {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService : WebhookService,
    @Inject('ExpressionDeliveryPort') 
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      pool: true, 
      maxConnections: 5, // gmail은 5가 최대
      maxMessages: 100, 
      rateLimit: 5        // 초당 전송 제한 // gmail은 초당 요청수가 작다
    });

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
  

  @Process({ name : 'send-verification', concurrency : 20 }) 
  async handleSendVerificationEmail(job: Job<{ to: string; html: string }>) {
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
    }
  } 

  @Process({name : 'send-expression' , concurrency : 20}) 
  async handleSendExpressionEmail(job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>) {
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

      // 웹훅을 이용해 발송 실패 알림
      const errorMessage = this.buildEmailFailureMessage(job, error);
      await this.webhookService.sendMessage(errorMessage);

      // Bull이 retry 하도록 명시적 throw
      throw new Error(`SMTP 전송 실패: ${error?.message ?? error}`);
    }
  }
}