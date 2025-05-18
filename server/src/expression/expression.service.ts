// src/expression/expression.service.ts
import { Injectable } from '@nestjs/common';
import { ExpressionRepository } from './expression.repository';
import { Expression } from './entities/expression.entity';

@Injectable()
export class ExpressionService {
  constructor(
    private readonly expressionRepository: ExpressionRepository,
  ) {}

  async getAllExpressions(): Promise<Expression[]> {
    return this.expressionRepository.findAll();
  }

  async createNewExpression(input: Expression): Promise<Expression> {
    
    return this.expressionRepository.save(input);
  }
}