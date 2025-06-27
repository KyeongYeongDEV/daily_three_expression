import { Inject, Injectable } from '@nestjs/common';
import { SendMailPort } from '../../mailer/port/out/send-mail.port';
import { UsersWithUuidType, UserEmailType } from 'src/common/types/user.type';
import { ExpressionResponseDto } from 'src/expression/dto/response.dto';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';
import { UserPort } from 'src/user/port/user.port';
import { SendExpressionMailParams } from 'src/mailer/type/send-expression-mail-params';
import { AuthServicePort } from 'src/auth/port/in/auth.service.port';

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
      //const users: UserEmailType[] = await this.userPort.findAllUsersEmail();
      const users: UserEmailType[] = [{email : 'cky4594709@gmail.com', u_id : 5}];
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
}
