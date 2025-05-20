import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpressionEntity } from '../entities/expression.entity';
import { EXPRESSION_PORT, ExpressionPort } from '../port/expression.port';
import { ExpressionResponseDto } from '../dto/response.dto';

@Injectable()
export class TypeOrmExpressionAdapter implements ExpressionPort {
  constructor(
    @InjectRepository(ExpressionEntity)
    private readonly orm: Repository<ExpressionEntity>,
  ) {}

  async save(expression: ExpressionEntity): Promise<ExpressionEntity> {
    return this.orm.save(expression);
  }

  async findAll(): Promise<ExpressionResponseDto[]> {
    return this.orm.find();
  }

  async findById(id: number): Promise<ExpressionResponseDto | null> {
    return this.orm.findOneBy({ e_id: id });
  }

  async findThreeExpressionsByStartIdAndCategory(startId: number, category: string): Promise<ExpressionResponseDto[]> {
    return this.orm.createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .andWhere('expression.category = :category', { category })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }

  async findThreeExpressionsByStartId(startId: number): Promise<ExpressionResponseDto[]> {
    return this.orm.createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }
}
