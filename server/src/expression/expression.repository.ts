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

  async findAll(): Promise<ExpressionEntity[]> {
    return this.expressionRepository.find();
  }

  async save(expression: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionRepository.save(expression);
  }

  async findById(id: number): Promise<ExpressionEntity | null> {
    return this.expressionRepository.findOneBy({ e_id: id });
  }

  async findThreeExpressionsByStartIdAndCategory(startId : number, category : string) : Promise<ExpressionEntity[] | null>{
    return this.expressionRepository
      .createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .andWhere('expression.category = :category', { category })
      .orderBy('expression.e_id', 'ASC') 
      .limit(3)
      .getMany();
  }

  async findThreeExpressionsByStartId(startId : number) : Promise<ExpressionEntity[] | null> {
    return this.expressionRepository
    .createQueryBuilder('expression')
    .where('expression.e_id >= :startId', { startId })
    .orderBy('expression.e_id', 'ASC') 
    .limit(3)
    .getMany();
  }

  async findByCategory(category : string): Promise<ExpressionEntity | null> {
    return this.expressionRepository.findOneBy({ category : category });
  }
}
