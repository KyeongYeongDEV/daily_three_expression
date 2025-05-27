import { Inject, Injectable } from '@nestjs/common';
import { ExpressionPort } from '../../expression/port/expression.port';
import { UserPort } from '../../user/port/user.port';
import { SendMailPort } from '../port/out/send-mail.port';

@Injectable()
export class BatchMailService {
  constructor(
    @Inject('ExpressionPort') private readonly expressionPort: ExpressionPort,
    @Inject('UserPort') private readonly userPort: UserPort,
    @Inject('SendMailPort') private readonly mailSender: SendMailPort,
  ) {}

  async sendTestEmails(): Promise<void> {
    const users : string[]= await this.userPort.findAllUsersEmail(); // findAllUsers가 없으면 추가 구현
    const expressions = await this.expressionPort.findThreeExpressionsByStartId(1);

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
      await this.mailSender.send(
        user,
        '오늘의 표현 3개입니다!',
        html
      );
    }
  }
}
