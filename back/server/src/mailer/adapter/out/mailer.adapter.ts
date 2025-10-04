import { Inject, Injectable } from '@nestjs/common';
import { SendMailPort } from '../../../mailer/port/out/send-mail.port';
import { UsersWithUuidType } from '../../../common/types/user.type';
import { ExpressionResponseDto } from '../../../expression/dto/response.dto';
import { buildExpressionMailTemplate } from '../../templates/expression-mail.template';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { buildVerificationCodeTemplate } from '../../../mailer/templates/verify-code.template';
import { TestUserPort } from '../../..//user/port/test-user.port';


// TODO service로 분리하기
@Injectable()
export class MailerAdapter implements SendMailPort {

  constructor(
    @InjectQueue('email') 
    private readonly emailQueue: Queue,
    @Inject('TestUserPort') 
    private readonly testUserPort: TestUserPort,
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
  
  async sendEmailsToAllTestUsers(): Promise<void> {
    console.log('[TEST BATCH START] 전체 테스트 사용자 대상 이메일 발송 작업을 시작합니다.');
    try {
      // 1. 테스트용 표현(공통 콘텐츠) 생성
      const { expressions, todayLastDeliveriedId } = this._createMockExpressions();

      // 2. 페이지네이션을 위한 변수 초기화
      let lastId = 0;
      const pageSize = 1000;
      let totalUserCount = 0;

      // 3. 루프를 돌며 모든 테스트 유저 처리
      while (true) {
        // 3-1. DB에서 한 페이지(1000명)의 테스트 유저 데이터를 가져옵니다.
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
        const userPage = await this.testUserPort.findUsersForBatch(lastId, pageSize);

        if (userPage.length === 0) {
          console.log('[TEST BATCH INFO] 모든 테스트 사용자에 대한 작업 생성을 완료했습니다.');
          break;
        }
        
        console.log(`[TEST BATCH INFO] u_id > ${lastId} 부터 ${userPage.length}명의 테스트 사용자를 처리합니다.`);

        // 3-2. 기존 sendExpression 메서드를 호출하여 현재 페이지의 잡(job)을 큐에 추가합니다.
        // TestUserPort의 findUsersForBatch가 UsersWithUuidType을 반환하도록 수정하거나, 여기서 변환이 필요합니다.
        // 여기서는 findUsersForBatch가 UsersWithUuidType을 반환한다고 가정합니다.
        await this.sendExpression(userPage as UsersWithUuidType[], expressions, todayLastDeliveriedId);

        totalUserCount += userPage.length;
        
        // 3-3. 다음 페이지 조회를 위해 마지막 사용자의 ID를 커서로 사용합니다.
        lastId = userPage[userPage.length - 1].u_id;
      }

      console.log(`[TEST BATCH END] 총 ${totalUserCount}명의 테스트 사용자에게 잡을 성공적으로 추가했습니다.`);
    } catch (error) {
      console.error('[TEST BATCH ERROR] 테스트 이메일 발송 작업 중 오류 발생:', error);
      throw new Error('전체 테스트 이메일 발송 작업에 실패했습니다.');
    }
  }

  private _createMockExpressions(): { expressions: ExpressionResponseDto[], todayLastDeliveriedId: number } {
    const expressions: ExpressionResponseDto[] = [
      {
        e_id: 100,
        category: "test",
        expression_number: 1000,
        expression: "Test Expression",
        example1: "Example 1",
        example2: "Example 2",
        translation_expression: "테스트 표현",
        translation_example1: "테스트 예시 1",
        translation_example2: "테스트 예시 2",
        created_at: new Date(),
        is_active: true,
      }
    ];
    const todayLastDeliveriedId = 99999999;
    return { expressions, todayLastDeliveriedId };
  }
}
