import { Inject, Injectable } from '@nestjs/common';
import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
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
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 5,
    });
  }

  async sendExpression(): Promise<void> {
    const users : string[]= await this.userPort.findAllUsersEmail(); // findAllUsers가 없으면 추가 구현
    const expressions = await this.expressionPort.findThreeExpressionsByStartId(1);

    //TODO html 구현하기
    const html = `
      <h3>🔥 오늘의 표현</h3>
      <ul>
        ${expressions
          .map(
            (e) => `
              <li><b>${e.expression}</b> - ${e.translation_expression}</li>
              <li>${e.example1} - ${e.translation_example1}</li>
              <li>${e.example2} - ${e.translation_example2}</li>
              <br/>
            `
          )
          .join('')}
      </ul>
    `;

    for (const user of users) {
      const info = await this.transporter.sendMail({
        from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`,
        to: user,
        subject: '오늘의 표현 3개입니다!',
        html,
      });
      console.log(`✅ Email sent: ${user}`, info.messageId);
    }
  }
  

  async sendEmailVerificationCode(to: string, code: string): Promise<boolean> {
    const html = `
      <h2>이메일 인증 코드</h2>
      <p>아래 코드를 입력해주세요:</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</div>
    `;
  
    const info = await this.transporter.sendMail({
      from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: '이메일 인증 코드입니다',
      html,
    });
  
    console.log('✅ Email sent:', info.messageId);

    return info.accepted.length > 0; // 성공적으로 전송되었는지 확인
  }
}
