import { Controller, Get, Param } from '@nestjs/common';
import { ExpressionService } from '../../service/expression.service';
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
  async getExpressionById(
    @Param('id') id : number,
  ) : Promise<ExpressionResponse>{
    return this.expressionService.getExpressionById( id );
  }

  @Get('three/:id')
  async getThreeExpressionsByStartId(
    @Param('id') id : number,
  ) : Promise<ExpressionListResponse>{
    return this.expressionService.getThreeExpressionsByStartId( id );
  }  
  
  @Get('three/:category/:id')
  async getThreeExpressionsByStartIdAndCategory(
    @Param('id') id : number,
    @Param('category') category : string,
  ) : Promise<ExpressionListResponse>{
    return this.expressionService.getThreeExpressionsByStartIdAndCategory( id, category );
  }

  @Get('deliveried/:u_id')
  async getDeliveriedExpressionsByUid(
    @Param('id') id : number,
  ) : Promise<ExpressionListResponse> {
    return this.expressionService.getDeliveriedExpressionsByUid( id );
  }

  
}