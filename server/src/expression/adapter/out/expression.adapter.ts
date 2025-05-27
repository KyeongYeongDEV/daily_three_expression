import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpressionEntity } from '../../domain/expression.entity';
import { EXPRESSION_PORT, ExpressionPort } from '../../port/expression.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { ExpressionBlackListEntity } from 'src/expression/domain/expression-black-list.entity';

@Injectable()
export class TypeOrmExpressionAdapter implements ExpressionPort {
  constructor(
    @InjectRepository(ExpressionEntity)
    private readonly expressionRepository: Repository<ExpressionEntity>,
    @InjectRepository(ExpressionBlackListEntity)
    private readonly expressionBlackListRepository: Repository<ExpressionBlackListEntity>,
  ) {}

  async save(expression: ExpressionEntity): Promise<ExpressionEntity> {
    return this.expressionRepository.save(expression);
  }

  async findAll(): Promise<ExpressionResponseDto[]> {
    return this.expressionRepository.find();
  }

  async findById(id: number): Promise<ExpressionResponseDto | null> {
    return this.expressionRepository.findOneBy({ e_id: id });
  }

  async findThreeExpressionsByStartIdAndCategory(startId: number, category: string): Promise<ExpressionResponseDto[]> {
    return this.expressionRepository.createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .andWhere('expression.category = :category', { category })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }

  async findThreeExpressionsByStartId(startId: number): Promise<ExpressionResponseDto[]> {
    return this.expressionRepository.createQueryBuilder('expression')
      .where('expression.e_id >= :startId', { startId })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }
  async saveExpressionBlackList(expression: string): Promise<ExpressionBlackListEntity> {
    const found = await this.expressionBlackListRepository.findOne({ where: { expression } });
  
    if (found) {
      found.count += 1;
      return this.expressionBlackListRepository.save(found);
    } else {
      return this.expressionBlackListRepository.save({ expression, count: 1 });
    }
  }
  
}
// 
// where expresion = :expression
// 
