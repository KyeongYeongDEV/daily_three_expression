import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { buildVerificationCodeTemplate } from '../templates/verify-code.template';
import { Inject } from '@nestjs/common';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';

@Processor('email')
export class EmailProcessor {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ExpressionDeliveryPort') 
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  @Process('send-verification')
  async handleSendVerificationEmail(job: Job<{ to: string; code: string }>) {
    const { to, code } = job.data;
    console.log(`[백그라운드] ${to}에게 인증 메일 전송 시작`);

    const html = buildVerificationCodeTemplate(code);

    const info = await this.transporter.sendMail({
      from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: '[하삼영] 이메일 인증 코드입니다.',
      html,
    });

    console.log(`[이메일 인증 전송 프로세스] ✅ 인증 코드 메일 전송 완료:`, info.messageId);
  }

  @Process('send-expression')
  async handleSendExpressionEmail(job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>) {
    const { to, html, u_id, deliveredId } = job.data;
    
    try {
      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 오늘의 표현 3개입니다!',
        html,
      });

      console.log(`[표현 전송 프로세스] ✅ 표현 이메일 전송 완료 → ${to}:`, info.messageId);

      await this.expressionDeliveryPort.saveExpressionDeliveried(u_id, deliveredId, 'success');
    } catch (error) {
      console.error(`[표현 전송 프로세스] ❌ 표현 이메일 전송 실패 → ${to}:`, error);
    }
  }
}