import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter : nodemailer.Transporter;

  constructor(private readonly configService : ConfigService){
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
      pool: true, 
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 5, // 초당 5개 제한
    });
  }

  async sendMail(to : string, subject : string, html : string) {
    const info = await this.transporter.sendMail({
      from: `"Daily3" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return info;
  }

}
