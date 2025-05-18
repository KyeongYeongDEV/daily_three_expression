// expression.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExpressionEntity } from './entities/expression.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpressionRepository {
  constructor(
    @InjectRepository(ExpressionEntity)
    private readonly expressionRepository: Repository<ExpressionEntity>,
  ) {}

  findAll(): Promise<ExpressionEntity[]> {
    return this.expressionRepository.find();
  }

  save(expression: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionRepository.save(expression);
  }

  findById(id: number): Promise<ExpressionEntity | null> {
    return this.expressionRepository.findOneBy({ e_id: id });
  }

  findByCategory(category : string): Promise<ExpressionEntity | null> {
    return this.expressionRepository.findOneBy({ category : category });
  }
}
