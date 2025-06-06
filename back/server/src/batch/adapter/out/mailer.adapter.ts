import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { UserPort } from 'src/user/port/user.port';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';
import { UserEmailType } from 'src/common/types/user.type';
import { ExpressionResponseDto } from 'src/expression/dto/response.dto';
import { buildExpressionMailTemplate } from '../../templates/expression-mail.template';
import { buildVerificationCodeTemplate } from '../../templates/verify-code.template';


// TODO service로 분리하기
@Injectable()
export class MailerAdapter implements SendMailPort {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    @Inject('ExpressionDeliveryPort')
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 5,
    });
  }

  private getYesterdayAndStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    return { today, yesterday };
  } 
// TODO HTML 따로 파일로 분리하기
  async sendExpression(): Promise<void> {
    const users: UserEmailType[] = await this.userPort.findAllUsersEmail();

    const { today, yesterday } = this.getYesterdayAndStart();
    const startEid : number = await this.expressionDeliveryPort.findStartExpressionId();

    const expressions : ExpressionResponseDto[] = await this.expressionPort.findThreeExpressionsByStartId(startEid);

    const html = buildExpressionMailTemplate(expressions);
  
    const todayLastDliveriedId = startEid + 3;
    const mailSender= this.configService.get('MAIL_USER');
    for (const user of users) {
      const info = await this.transporter.sendMail({
        from: `"하삼영" ${mailSender}`,
        to: user.email,
        subject: '[하삼영] 오늘의 표현 3개입니다!',
        html,
      });

      await this.expressionDeliveryPort.saveExpressionDeliveried(user.u_id, todayLastDliveriedId, 'success');
      
      console.log(`✅ Email sent to ${user}:`, info.messageId);
    }
  }

  async sendEmailVerificationCode(to: string, code: string): Promise<boolean> {
    const html = buildVerificationCodeTemplate(code);

    const info = await this.transporter.sendMail({
      from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: '[하삼영] 이메일 인증 코드입니다.',
      html,
    });

    console.log('✅ 인증 코드 메일 전송 완료:', info.messageId);
    return info.accepted.length > 0;
  }
}
