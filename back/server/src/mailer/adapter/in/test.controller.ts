import { Controller, Inject, Post } from "@nestjs/common";
import { MailerAdapter } from "../out/mailer.adapter";
import { UsersWithUuidType } from "../../../common/types/user.type";
import { ExpressionResponse } from "../../../common/types/response.type";
import { ExpressionResponseDto } from "../../../expression/dto/response.dto";
import { TestUserPort } from "../../../user/port/test-user.port";
import { BlockingMailerService } from "../../../mailer/service/blocking-mailer.service";

@Controller('test')
export class TestController {
  constructor( 
    private readonly mailerAdapter : MailerAdapter,
    @Inject(TestUserPort)
    private readonly testUserPort: TestUserPort,
    private readonly blockingMailerService : BlockingMailerService

  ){}

  @Post('/expression')
  async triggerExpression() {
    const users : UsersWithUuidType[] = await this.testUserPort.findAll();

    const expressions : ExpressionResponseDto[] =[
      {
        e_id: 100,
        category: "sdf",
        expression_number: 1000,
        expression: "영어표현",
        example1: "예시1",
        example2: "예시2",
        translation_expression: "해석",
        translation_example1: "예석 해석 1",
        translation_example2: "예석 해석 2",
        created_at : new Date(),
        is_active : true,
      }
    ];

    const todayLastDeliveriedId = 99999999;


    await this.mailerAdapter.sendExpression(users, expressions, todayLastDeliveriedId);
    return 'Expression job triggered';
  }


  @Post('/emails/all-test-users')
  async triggerSendEmailsToAllTestUsers() {
    await this.mailerAdapter.sendEmailsToAllTestUsers();

    return {
      message: 'Batch email job for ALL TEST USERS has been triggered.',
    };
  }

  @Post('/')
  async triggerSendEmail() {
   
    
  }

  @Post('/verify/email')
  async triggerBlockingSend() {
    // 이 요청은 모든 이메일 발송이 끝날 때까지 응답하지 않고 기다립니다.
    const result = await this.blockingMailerService.sendEmailVerificationCode_Before();
    return result;
  }
}