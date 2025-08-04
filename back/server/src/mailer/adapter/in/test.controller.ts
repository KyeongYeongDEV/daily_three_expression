import { Controller, Inject, Post } from "@nestjs/common";
import { MailerAdapter } from "../out/mailer.adapter";
import { UsersWithUuidType } from "src/common/types/user.type";
import { ExpressionResponse } from "src/common/types/response.type";
import { ExpressionResponseDto } from "src/expression/dto/response.dto";
import { TestUserPort } from "src/user/port/test-user.port";

@Controller('test')
export class TestController {
  constructor( 
    private readonly mailerAdapter : MailerAdapter,
    @Inject(TestUserPort)
    private readonly testUserPort: TestUserPort,

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
  @Post('/verify/email')
  async triggerSendEmail() {
    
  }
}