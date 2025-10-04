import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { UserPort } from '../../user/port/user.port';
import { buildExpressionMailTemplate } from '../templates/expression-mail.template';
import { buildVerificationCodeTemplate } from '../../mailer/templates/verify-code.template';

@Injectable()
export class BlockingMailerService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {
    // 실제 SMTP Pool을 사용하면 테스트 결과에 영향을 줄 수 있으므로,
    // 이 테스트에서는 Pool을 사용하지 않는 Transporter를 만듭니다.
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendEmailsToAllUsers(): Promise<{ count: number }> {
    // 1. 모든 사용자를 한 번에 조회 (메모리 사용량 증가 원인)
    //const users = await this.userPort.findAllUsersEmail();
    const users = [
      { "u_id": 1, "email": "test1@example.com" }
    ];

    
    // 테스트를 위한 Mock 표현 데이터
    const expressions = [{ e_id: 1, expression: 'Test', example1: 'Test', example2: 'Test' }];
    const unsubscribeUrl = 'http://localhost';
    const html = buildExpressionMailTemplate(expressions as any, unsubscribeUrl);

    console.log(`[BLOCKING-TEST] 총 ${users.length}명의 사용자에게 메일 발송을 시작합니다...`);

    // 2. 루프를 돌며 await를 사용해 동기적으로 메일 발송 (블로킹 발생 지점)
    for (const user of users) {
      // await가 끝날 때까지 이벤트 루프가 여기서 멈춥니다.
      await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to: user.email,
        subject: '[Test] 이메일 발송 성능 테스트',
        html,
      });

   
      console.log(`[BLOCKING-TEST] -> ${user.email} 발송 완료`);
    }

    return { count: users.length };
  }

  async sendEmailVerificationCode_Before(): Promise<boolean> {
    try {
      const to = 'cky4594709@gmail.com'
      const code = "123456"
      const html = buildVerificationCodeTemplate(code);

      // --- 핵심 변경점 ---
      // 큐에 작업을 추가하는 대신, sendMail을 직접 await 합니다.
      // 이 작업이 완료될 때까지 여기서 모든 것이 멈춥니다.
      await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 이메일 인증 코드입니다.',
        html,
      });
      // const randomDelay = Math.floor(Math.random() * 251) + 50; // 50 ~ 300 사이의 난수 생성
      // await new Promise(resolve => setTimeout(resolve, randomDelay)); 

      console.log(`[SYNC-SEND] ✅ ${to}로 인증 메일 전송 완료`);
      return true;

    } catch (error) {
      console.error('❌ 동기 메일 전송 중 에러 발생:', error);
      // 에러를 던져서 호출한 쪽에서 실패를 인지하게 합니다.
      throw error;
    }
  }
}