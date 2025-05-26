import { Injectable } from '@nestjs/common';
import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerAdapter implements SendMailPort {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 5,
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`, // 발신자 이메일
      to, // 디비로 조회할 것
      subject,// 제목
      html,
    });

    console.log('✅ Email sent:', info.messageId);
  }
}
