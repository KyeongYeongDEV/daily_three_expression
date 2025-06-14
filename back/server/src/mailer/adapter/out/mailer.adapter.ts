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

  private getYesterdayAndStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    return { today, yesterday };
  } 

  async sendExpression(): Promise<void> {
    try {
      const users: UserEmailType[] = await this.userPort.findAllUsersEmail();
      //const users = [{u_id : 5, email : 'cky4594709@gmail.com'}];
      const startEid: number = await this.expressionDeliveryPort.findStartExpressionId();
      const expressions: ExpressionResponseDto[] = await this.expressionPort.findThreeExpressionsByStartId(startEid);
  
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
      await this.emailQueue.add('send-verification', {
        to,
        code,
      });

      console.log(`✅ ${to}로 가는 인증 메일 잡을 큐에 추가했습니다.`);
      return true; 
      
    } catch (error) {
      console.error('메일 잡을 큐에 추가하는 중 에러 발생:', error);
      return false;
    }
  }
}
