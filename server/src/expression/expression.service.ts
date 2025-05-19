import { Injectable } from '@nestjs/common';
import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { ExpressionResponseDto } from './dto/response/expression-response.dto';
import { ExpressionListResponse } from 'src/common/types/response.type';

@Injectable()
export class ExpressionService {
  constructor(
    private readonly expressionRepository: ExpressionRepository,
  ) {}

  async getAllExpressions(): Promise<ExpressionListResponse> {
    try {
      const result : ExpressionResponseDto[] = await this.expressionRepository.findAll();
      return ResponseHelper.success( result, '이미 등록된 토큰입니다. 활성화 상태로 업데이트되었습니다.');
    } catch (error) {
      console.error(error);
      return ResponseHelper.fail('표현 조회 중 에러가 발생했습니다.');
    }
  }

  async createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionRepository.save(input);
  }
}