import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailerSerivce : MailerService,
  ){}

  @Get('/send')
  async sendEmail() {
    //TODO @Param() 으로 받는 유저의 이메일로 변경
    return await this.mailerSerivce.sendMail(
      'cky4594709@gmail.com',
      '오늘의 표현 3개입니다!',
      '<h3>🔥 오늘의 표현</h3><ul><li>I’m into it.</li><li>That’s a good call.</li><li>What do you mean?</li></ul>',
    );
  }
}
