import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExpressionEntity } from '../entities/expression.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpressionRepository {
  constructor(
    @InjectRepository(ExpressionEntity)
    private readonly orm: Repository<ExpressionEntity>,
  ) {}     

  async save(expression: ExpressionEntity): Promise<ExpressionEntity> {
    return this.orm.save(expression);
  }
  
  async findAll(): Promise<ExpressionEntity[]> {
    return this.orm.find();
  }

  async findById(id: number): Promise<ExpressionEntity | null> {
    return this.orm.findOneBy({ e_id: id });
  }

  async findThreeExpressionsByStartIdAndCategory(startId : number, category : string) : Promise<ExpressionEntity[] | null>{
    return this.orm
      .createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .andWhere('expression.category = :category', { category })
      .orderBy('expression.e_id', 'ASC') 
      .limit(3)
      .getMany();
  }

  async findThreeExpressionsByStartId(startId : number) : Promise<ExpressionEntity[] | null> {
    return this.orm
    .createQueryBuilder('expression')
    .where('expression.e_id >= :startId', { startId })
    .orderBy('expression.e_id', 'ASC') 
    .limit(3)
    .getMany();
  }

  async findByCategory(category : string): Promise<ExpressionEntity | null> {
    return this.orm.findOneBy({ category : category });
  }
}
