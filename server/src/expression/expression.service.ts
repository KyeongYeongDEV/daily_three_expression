// src/expression/expression.service.ts
import { Injectable } from '@nestjs/common';
import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';

@Injectable()
export class ExpressionService {
  constructor(
    private readonly expressionRepository: ExpressionRepository,
  ) {}

  async getAllExpressions(): Promise<ExpressionEntity[] | string> {
    try {
      return this.expressionRepository.findAll();
    } catch (error) {
      console.error(error)
      return '에러'
    }
    
  }

  async createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity> {
    
    return this.expressionRepository.save(input);
  }
}