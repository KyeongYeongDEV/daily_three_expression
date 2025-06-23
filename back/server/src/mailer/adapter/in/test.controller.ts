import { Controller, Post } from "@nestjs/common";
import { MailerAdapter } from "../out/mailer.adapter";

@Controller('test')
export class TestController {
  constructor(private readonly mailerAdapter : MailerAdapter){}

  @Post('/expression')
  async triggerExpression() {
    await this.mailerAdapter.testSendExpression();
    return 'Expression job triggered';
  }
}