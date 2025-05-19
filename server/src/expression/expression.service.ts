import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ExpressionResponseDto } from './dto/response/expression-response.dto';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';

@Injectable()
export class ExpressionService {
  constructor(
    private readonly expressionRepository: ExpressionRepository,
  ) {}

  async getAllExpressions(): Promise<ExpressionListResponse> {
    try {
      const result : ExpressionResponseDto[] = await this.expressionRepository.findAll();
      return ResponseHelper.success( result, '모든 표현들 조회를 성공했습니다.');
    } catch (error) {
      console.error('[getAllExpressions]' + error);
      return ResponseHelper.fail('모든 표현들 조회 중 에러가 발생했습니다.');
    }
  }

  async getExpressionById(id : number) : Promise<ExpressionResponse> {
    try {
      const result : ExpressionResponseDto | null = await this.expressionRepository.findById(id);

      if(!result){
        throw new NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
      }
      
      return ResponseHelper.success(result, `id : ${id} 조회를 성공했습니다.`);
    } catch (error) {
      console.error('[getExpressionById]' + error);
      return ResponseHelper.fail('하나의 표현 조회 중 에러가 발생했습니다');
    }
  }

  async getThreeExpressionsByStartId(id : number) : Promise<ExpressionListResponse>{
    try {
      //TODO 만약에 startId가 마지막 id이거나 마지막 전 id일 경우 3개를 못 가져옴 - 처리하기
      const result : ExpressionResponseDto[] | null =  await this.expressionRepository.findThreeExpressionsByStartId(id);
      
      if(!result){
        throw new NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
      }

      return ResponseHelper.success(result, `id ${id}부터 표현 3개 조회를 성공했습니다.`);
    } catch (error) {
      console.error(`[getThreeExpressionsByStartId]` + error);
      return ResponseHelper.fail(`id ${id}부터 표현 3개 조회에 실패 했습니다.`)
    }
  }
  

  async createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionRepository.save(input);
  }
}