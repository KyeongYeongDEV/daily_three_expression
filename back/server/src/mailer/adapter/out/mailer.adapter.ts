import { Injectable } from '@nestjs/common';
import { SendMailPort } from 'src/mailer/port/out/send-mail.port';
import { UsersWithUuidType } from 'src/common/types/user.type';
import { ExpressionResponseDto } from '../../../expression/dto/response.dto';
import { buildExpressionMailTemplate } from '../../templates/expression-mail.template';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { buildVerificationCodeTemplate } from 'src/mailer/templates/verify-code.template';


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

  async sendExpression(usersWithUuid : UsersWithUuidType[], expressions : ExpressionResponseDto[], todayLastDeliveriedId : number): Promise<void> {
    try {
      const baseUrl = 'https://www.dailyexpression.site/unsubscribe';
      const batchSize = 5; // 5명씩 보내기(최적화 필요시 숫자 조절)
      const userChunks = this.chunkArray(usersWithUuid, batchSize);

      for (const chunk of userChunks) {
        await Promise.all(
          chunk.map(async (user) => {
            const uuidToken = user.uuid;
            const unsubscribeUrl = `${baseUrl}?email=${user.email}&token=${uuidToken}`;
            const html = buildExpressionMailTemplate(expressions, unsubscribeUrl);

            await this.emailQueue.add(
              'send-expression',
              {
                to: user.email,
                html,
                u_id: user.u_id,
                deliveredId: todayLastDeliveriedId,
              },
              {
                attempts: 3, // 3회까지 재시도
                backoff: { type: 'exponential', delay: 1000 }, // 1,2,4초 간격
              }
            );
            console.log(`✅ ${user.email}로 가는 표현 메일 잡을 큐에 추가`);
          })
        );
        // 0~800ms 랜덤 딜레이 => SMTP/서버 부하 방지
        await new Promise((res) => setTimeout(res, Math.random() * 800));
      }
    } catch (error) {
      console.error('표현 메일 큐 추가 중 에러:', error);
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
