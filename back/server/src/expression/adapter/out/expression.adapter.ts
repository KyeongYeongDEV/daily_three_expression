import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpressionEntity } from '../../domain/expression.entity';
import { EXPRESSION_PORT, ExpressionPort } from '../../port/expression.port';
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
    console.log(`🧪 saveExpressionBlackList 호출됨: ${expression}`); // 이거 추가
  
    const found = await this.expressionBlackListRepository.findOne({ where: { expression } });
  
    if (found) {
      found.count += 1;
      const result = await this.expressionBlackListRepository.save(found);
      console.log(`🔁 count 증가 완료: ${found.expression} → ${found.count}`);
      return result;
    } else {
      const newEntry = this.expressionBlackListRepository.create({
        expression,
        count: 1,
      });
      const result = await this.expressionBlackListRepository.save(newEntry);
      console.log(`🆕 새 표현 저장 완료: ${newEntry.expression}`);
      return result;
    }
  }
  

  async findTop5BlacklistedExpressions(): Promise<string[]> {
    const records = await this.expressionBlackListRepository
      .createQueryBuilder('blacklist')
      .orderBy('blacklist.count', 'DESC')
      .limit(5)
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
