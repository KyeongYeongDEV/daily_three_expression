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
      await this.mailSender.sendEmail(
        user,
        '오늘의 표현 3개입니다!',
        html
      );
    }
  }
  

  async sendCode(to: string): Promise<void> {
    const info = await this.transporter.sendMail({
      from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`, // 발신자 이메일
      to, // 디비로 조회할 것
      subject,// 제목
      html,
    });

    console.log('✅ Email sent:', info.messageId);
  }

}
