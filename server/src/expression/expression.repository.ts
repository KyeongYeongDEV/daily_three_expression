// expression.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expression } from './entities/expression.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpressionRepository {
  constructor(
    @InjectRepository(Expression)
    private readonly expressionRepository: Repository<Expression>,
  ) {}

  findAll(): Promise<Expression[]> {
    return this.expressionRepository.find();
  }

  save(expression: Expression): Promise<Expression> {
    return this.expressionRepository.save(expression);
  }

  findById(id: number): Promise<Expression | null> {
    return this.expressionRepository.findOneBy({ e_id: id });
  }

  findByCategory(category : string): Promise<Expression | null> {
    return this.expressionRepository.findOneBy({ category : category });
  }
}
