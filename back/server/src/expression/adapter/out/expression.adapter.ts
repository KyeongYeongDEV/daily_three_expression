import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpressionEntity } from '../../domain/expression.entity';
import { ExpressionPort } from '../../port/expression.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { ExpressionBlackListEntity } from 'src/expression/domain/expression-black-list.entity';

@Injectable()
export class ExpressionAdapter implements ExpressionPort {
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
      .where('expression.e_id > :startId', { startId })
      .andWhere('expression.category = :category', { category })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }

  async findThreeExpressionsByStartId(startId: number): Promise<ExpressionResponseDto[]> {
    return this.expressionRepository.createQueryBuilder('expression')
      .where('expression.e_id > :startId', { startId })
      .orderBy('expression.e_id', 'ASC')
      .limit(3)
      .getMany();
  }

  async saveExpressionBlackList(expression: string): Promise<ExpressionBlackListEntity> {
    await this.expressionBlackListRepository.query(
      `
      INSERT INTO expression_black_list(expression, count)
      VALUES ($1, 1)
      ON CONFLICT (expression)
      DO UPDATE SET count = expression_black_list.count + 1
      `,
      [expression]
    );
    
    const updated = await this.expressionBlackListRepository.findOne({ where: { expression } });
    return updated!;
  }
  
  
  async findTop10BlacklistedExpressions(): Promise<string[]> {
    const records = await this.expressionBlackListRepository
      .createQueryBuilder('blacklist')
      .orderBy('blacklist.count', 'DESC')
      .limit(10)
      .getMany();
  
    return records.map(record => record.expression);
  } 

  toEntity(dto: any): ExpressionEntity {
    const entity = new ExpressionEntity();
    entity.category = dto.category;
    entity.expression = dto.expression;
    entity.example1 = dto.example1;
    entity.example2 = dto.example2;
    entity.translation_expression = dto.translation_expression;
    entity.translation_example1 = dto.translation_example1;
    entity.translation_example2 = dto.translation_example2;
    return entity;
  }
} 
