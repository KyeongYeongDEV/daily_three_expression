import { Controller, Get } from '@nestjs/common';
import { ExpressionService } from './expression.service';

@Controller('expression')
export class ExpressionController {
  constructor(
    private readonly expressionSerivce : ExpressionService,
  ){}

  @Get('test')
  async getExpressions() {
    return this.expressionSerivce.getAllExpressions();
  }
  
}
