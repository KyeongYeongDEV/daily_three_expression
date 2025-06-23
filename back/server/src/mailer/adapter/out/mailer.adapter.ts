import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailPort } from 'src/mailer/port/out/send-mail.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { UserPort } from 'src/user/port/user.port';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';
import { UserEmailType } from 'src/common/types/user.type';
import { ExpressionResponseDto } from 'src/expression/dto/response.dto';
import { buildExpressionMailTemplate } from '../../templates/expression-mail.template';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { buildVerificationCodeTemplate } from 'src/mailer/templates/verify-code.template';


// TODO service로 분리하기
@Injectable()
export class MailerAdapter implements SendMailPort {

  constructor(
    private readonly configService: ConfigService,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    @Inject('ExpressionDeliveryPort')
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
    @Inject('UserPort')
    private readonly userPort: UserPort,
    @InjectQueue('email') 
    private readonly emailQueue: Queue,
  ) {}

  async testSendExpression(): Promise<void> {
    try {
      const html = buildVerificationCodeTemplate('123456');
      const deliveredId = 99999;
  
      const TOTAL_TEST_USERS = 1000;
  
      for (let i = 1; i <= TOTAL_TEST_USERS; i++) {
        await this.emailQueue.add('send-expression-test', {
          to: `test${i}@example.com`,
          html,
          u_id: i,
          deliveredId,
        });
        console.log(`📨 테스트 이메일 큐 추가 완료 → test${i}@example.com`);
      }

      console.log(`✅ 총 ${TOTAL_TEST_USERS}건의 테스트 잡이 큐에 추가되었습니다.`);

    } catch (error) {
      console.error('❌ 테스트 표현 메일 큐 추가 중 에러 발생:', error);
    }
  }

  async sendExpression(): Promise<void> {
    try {
      const users: UserEmailType[] = await this.userPort.findAllUsersEmail();
      const startEid: number = await this.expressionDeliveryPort.findStartExpressionId();
      const expressions: ExpressionResponseDto[] = await this.expressionPort.findThreeExpressionsByStartId(startEid);
  
      if (!expressions || expressions.length !== 3) {
        console.warn('[SKIP] 표현 3개를 정상적으로 불러오지 못했습니다. 메일 전송 중단');
        return;
      }
  
      const html = buildExpressionMailTemplate(expressions);
      const todayLastDliveriedId = expressions[2].e_id;
  
      for (const user of users) {
        await this.emailQueue.add('send-expression', {
          to: user.email,
          html,
          u_id: user.u_id,
          deliveredId: todayLastDliveriedId,
        });
        console.log(`✅ ${user.email}로 가는 표현 메일 잡을 큐에 추가했습니다.`);
      }
  
    } catch (error) {
      console.error('표현 메일 잡을 큐에 추가하는 중 에러 발생:', error);
    }
  }

  async sendEmailVerificationCode(to: string, code: string): Promise<boolean> {
    try {
      const html = buildVerificationCodeTemplate(code)
      await this.emailQueue.add('send-verification', {
        to,
        html,
      });

      console.log(`✅ ${to}로 가는 인증 메일 잡을 큐에 추가했습니다.`);
      return true; 
      
    } catch (error) {
      console.error('메일 잡을 큐에 추가하는 중 에러 발생:', error);
      return false;
    }
  }
}
