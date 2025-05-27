import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EXPRESSION_PORT, ExpressionPort } from '../port/expression.port';
import { EXPRESSION_DELIVERY_PORT, ExpressionDeliveryPort } from '../port/expression-delivery.port';
import { ExpressionEntity } from '../domain/expression.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ExpressionResponseDto } from '../dto/response.dto';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';
import { ExpressionBlackListEntity } from '../domain/expression-black-list.entity';

@Injectable()
export class ExpressionService {
  constructor(
    @Inject(EXPRESSION_PORT)
    private readonly expressionPort: ExpressionPort,
    @Inject(EXPRESSION_DELIVERY_PORT)
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {}

  async getAllExpressions() : Promise<ExpressionListResponse> {
    try {
      const result : ExpressionResponseDto[] = await this.expressionPort.findAll();
      return ResponseHelper.success( result, '모든 표현들 조회를 성공했습니다.');
    } catch (error) {
      console.error('[getAllExpressions]' + error);
      return ResponseHelper.fail('모든 표현들 조회 중 에러가 발생했습니다.');
    }
  }

  async getExpressionById(id : number) : Promise<ExpressionResponse> {
    try {
      const result : ExpressionResponseDto | null = await this.expressionPort.findById(id);

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
      const result : ExpressionResponseDto[] | null =  
        await this.expressionPort.findThreeExpressionsByStartId(id);
      
      if(!result){
        throw new NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
      }

      return ResponseHelper.success(result, `id ${id}부터 표현 3개 조회를 성공했습니다.`);
    } catch (error) {
      console.error(`[getThreeExpressionsByStartId]` + error);
      return ResponseHelper.fail(`id ${id}부터 표현 3개 조회 중 에러가 발생했습니다.`)
    }
  }
  
  async getThreeExpressionsByStartIdAndCategory(id : number, category : string) : Promise<ExpressionListResponse> {
    try {
      //TODO 만약에 startId가 마지막 id이거나 마지막 전 id일 경우 3개를 못 가져옴 - 처리하기
      const result : ExpressionResponseDto[] | null = 
        await this.expressionPort.findThreeExpressionsByStartIdAndCategory( id, category );

      if(!result){
        throw new NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
      }
      return ResponseHelper.success(result, `${category}에서 id ${id}로 시작하는 표현 3개 조회를 성공했습니다`)
    } catch (error) {
      console.error('[getThreeExpressionsByStartIdAndCategory]', error);
      return ResponseHelper.fail(`${category}에서 id ${id}로 시작하는 표현 3개 조회 중 에러가 발생했습니다`)
    }
  }

  async getDeliveriedExpressionsByUid( id : number ) : Promise<ExpressionListResponse> {
    try {
      const result :ExpressionResponseDto[] | null = await this.expressionDeliveryPort.findDeliveriedExpressionsByUid( id );
      return ResponseHelper.success(result, `${id}에 전송된 모든 표현 조회에 성공했습니다.`);
    } catch (error) {
      console.error('[getDeliveriedExpressionsByUid]', error);
      return ResponseHelper.fail(`${id}에 전송된 모든 표현 조회에 실패했습니다.`)
    }
  }

  async createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionPort.save(input);
  }

  async saveExpressionBlackList(expression: string): Promise<string> {
    const result: ExpressionBlackListEntity = await this.expressionPort.saveExpressionBlackList(expression);
  
    return result.count > 1
      ? `🔁 '${expression}' 중복 count 증가 → ${result.count}`
      : `🆕 '${expression}' 새로 저장됨 (count = 1)`;
  }
  
}