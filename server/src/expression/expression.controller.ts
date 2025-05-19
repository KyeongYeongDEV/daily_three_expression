import { Controller, Get, Param } from '@nestjs/common';
import { ExpressionService } from './expression.service';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';

@Controller('expression')
export class ExpressionController {
  constructor(
    private readonly expressionService : ExpressionService,
  ){}

  @Get('all')
  async getExpressions() : Promise<ExpressionListResponse>{
    return this.expressionService.getAllExpressions();
  }
  @Get('one/:id')
  async getExpressionById(@Param('id') id : number) : Promise<ExpressionResponse>{
    return this.expressionService.getExpressionById(id);
  }

  @Get('three/:id')
  async getThreeExpressionsByStartId(@Param('id') id : number) : Promise<ExpressionListResponse>{
    return this.expressionService.getThreeExpressionsByStartId(id);
  }
}
