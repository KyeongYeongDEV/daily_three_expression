import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { UserPort } from 'src/user/port/user.port';

@Injectable()
export class MailerAdapter implements SendMailPort {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 5,
    });
  }

  async sendExpression(): Promise<void> {
    const users: string[] = await this.userPort.findAllUsersEmail();
    const expressions = await this.expressionPort.findThreeExpressionsByStartId(1);

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
      <h2 style="text-align: center; color: #007bff;">🔥 오늘의 영어 표현 3개</h2>
      ${expressions.map(e => `
        <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
          <p><strong>표현:</strong> ${e.expression}</p>
          <p><strong>뜻:</strong> ${e.translation_expression}</p>
          <p><strong>예제 1:</strong> ${e.example1} <br/><strong>해석:</strong> ${e.translation_example1}</p>
          <p><strong>예제 2:</strong> ${e.example2} <br/><strong>해석:</strong> ${e.translation_example2}</p>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://little-spectrum-92b.notion.site/1f281d8a13f08072b5eed89fec38b6a6?pvs=105" target="_blank"
          style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          건의사항 작성하러 가기
        </a>
      </div>
  
      <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        © 하삼영 | 하루 3개의 패턴 영어
      </p>
    </div>
  `;
  

    for (const user of users) {
      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to: user,
        subject: '[하삼영] 오늘의 표현 3개입니다!',
        html,
      });
      console.log(`✅ Email sent to ${user}:`, info.messageId);
    }
  }

  async sendEmailVerificationCode(to: string, code: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f5f5f5; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #333;">🔐 이메일 인증 코드</h2>
        <p style="font-size: 16px;">아래 코드를 입력해주세요:</p>
        <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">${code}</div>
        <p style="font-size: 12px; color: gray;">이 코드는 발송 후 10분 동안 유효합니다.</p>
        <hr/>
        <p style="font-size: 10px; text-align: center; color: #999;">하삼영 | 하루 3개의 패턴 영어</p>
      </div>
    `;

    const info = await this.transporter.sendMail({
      from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: '[하삼영] 이메일 인증 코드입니다.',
      html,
    });

    console.log('✅ 인증 코드 메일 전송 완료:', info.messageId);
    return info.accepted.length > 0;
  }
}
