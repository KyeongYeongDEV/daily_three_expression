import { Inject, Injectable } from '@nestjs/common';
import { SendMailPort } from '../../mailer/port/out/send-mail.port';
import { UsersWithUuidType, UserEmailType } from '../../common/types/user.type';
import { ExpressionResponseDto } from '../../expression/dto/response.dto';
import { ExpressionPort } from '../../expression/port/expression.port';
import { ExpressionDeliveryPort } from '../../expression/port/expression-delivery.port';
import { UserPort } from '../../user/port/user.port';
import { AuthServicePort } from '../../auth/port/in/auth.service.port';

@Injectable()
export class BatchMailService {
  constructor(
    @Inject('SendMailPort') 
    private readonly mailSender: SendMailPort,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    @Inject('ExpressionDeliveryPort') 
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
    @Inject('UserPort')
    private readonly userPort: UserPort,
    @Inject('AuthServicePort')
    private readonly authService : AuthServicePort, 
    
  ) {}

  async sendEmails(): Promise<void> {
    try {
      const users: UserEmailType[] = await this.userPort.findAllUsersEmail();
      //const users: UserEmailType[] = [{email : 'cky4594709@gmail.com', u_id : 5}];
      const startEid: number = await this.expressionDeliveryPort.findStartExpressionId();
      const expressions: ExpressionResponseDto[] = await this.expressionPort.findThreeExpressionsByStartId(startEid);

      if (!expressions || expressions.length !== 3) {
        console.warn('[SKIP] 표현 3개를 정상적으로 불러오지 못했습니다. 메일 전송 중단');
        return;
      }
      const usersWithUuid : UsersWithUuidType[] = await this.authService.createUuidTokenForEmails(users);
      const todayLastDeliveriedId = expressions[2].e_id;      

      await this.mailSender.sendExpression(usersWithUuid, expressions, todayLastDeliveriedId);
    } catch (error) { 
      console.error('Error sending test emails:', error);
      throw new Error('Failed to send test emails');
    }
  }
  
  async sendEmailsToAllUsers(): Promise<void> {
    console.log('[BATCH START] 전체 사용자 대상 이메일 발송 작업을 시작합니다.');
    try {
      const startEid: number = await this.expressionDeliveryPort.findStartExpressionId();
      const expressions: ExpressionResponseDto[] = await this.expressionPort.findThreeExpressionsByStartId(startEid);

      if (!expressions || expressions.length !== 3) {
        console.warn('[SKIP] 표현 3개를 정상적으로 불러오지 못했습니다. 메일 전송 중단');
        return;
      }
      const todayLastDeliveriedId = expressions[2].e_id;

      let lastId = 0;
      const pageSize = 1000; 
      let totalUserCount = 0;

      while (true) {
        const userPage: UserEmailType[] = await this.userPort.findUsersForBatch(lastId, pageSize);

        if (userPage.length === 0) {
          console.log('[BATCH INFO] 모든 사용자에 대한 작업 생성을 완료했습니다.');
          break;
        }

        console.log(`[BATCH INFO] u_id > ${lastId} 부터 ${userPage.length}명의 사용자를 처리합니다.`);

        const usersWithUuid: UsersWithUuidType[] = await this.authService.createUuidTokenForEmails(userPage);

        await this.mailSender.sendExpression(usersWithUuid, expressions, todayLastDeliveriedId);

        totalUserCount += userPage.length;
        console.log(`[BATCH INFO] ${userPage.length}명에 대한 잡 추가 완료 (누적: ${totalUserCount}명)`);

        lastId = userPage[userPage.length - 1].u_id;
      }

      console.log(`[BATCH END] 총 ${totalUserCount}명의 사용자에게 이메일 발송 잡을 성공적으로 추가했습니다.`);

    } catch (error) {
      console.error('[BATCH ERROR] 이메일 발송 작업 중 심각한 오류가 발생했습니다:', error);
      throw new Error('전체 이메일 발송 작업에 실패했습니다.');
    }
  }
}
