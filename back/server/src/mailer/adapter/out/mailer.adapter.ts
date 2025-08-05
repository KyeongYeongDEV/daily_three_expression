import { Injectable } from '@nestjs/common';
import { SendMailPort } from '../../../mailer/port/out/send-mail.port';
import { UsersWithUuidType } from '../../../common/types/user.type';
import { ExpressionResponseDto } from '../../../expression/dto/response.dto';
import { buildExpressionMailTemplate } from '../../templates/expression-mail.template';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { buildVerificationCodeTemplate } from '../../../mailer/templates/verify-code.template';


// TODO service로 분리하기
@Injectable()
export class MailerAdapter implements SendMailPort {

  constructor(
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

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  async sendExpression(
    usersWithUuid: UsersWithUuidType[],
    expressions: ExpressionResponseDto[],
    todayLastDeliveriedId: number,
  ): Promise<void> {
    try {
      const baseUrl: string = 'https://www.dailyexpression.site/unsubscribe';
  
      for (const user of usersWithUuid) {
        const uuidToken: string = user.uuid;
        const unsubscribeUrl: string = `${baseUrl}?email=${user.email}&token=${uuidToken}`;
        const html: string = buildExpressionMailTemplate(expressions, unsubscribeUrl);
  
        await this.emailQueue.add(
          'send-expression',
          {
            to: user.email,
            html,
            u_id: user.u_id,
            deliveredId: todayLastDeliveriedId,
          },
          {
            removeOnComplete: true,
            removeOnFail: false,
          },
        );
  
        console.log(`✅ ${user.email}로 가는 표현 메일 잡을 큐에 추가`);
      }
    } catch (error: unknown) {
      console.error('표현 메일 큐 추가 중 에러:', error);
    }
  }
  

  async sendEmailVerificationCode(to: string, code: string): Promise<boolean> {
    try {
      const html = buildVerificationCodeTemplate(code);
  
      // 큐 비동기 추가 (응답시간 최소화)
      this.emailQueue.add(
        'send-verification',
        { to, html },
        { removeOnComplete: true, removeOnFail: false }
      ).catch(err => {
        console.error('❌ 큐 추가 실패:', err);
      });
  
      return true;
    } catch (error) {
      console.error('❌ 큐 작업 중 에러 발생:', error);
      return false;
    }
  }
  
}
