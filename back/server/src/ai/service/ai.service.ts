import { Inject, Injectable } from '@nestjs/common';
import { GeminiPort } from '../port/out/gemini.port';
import { QdrantPort } from '../port/out/qdrant.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';

@Injectable()
export class AiService {
  constructor(
    @Inject('GeminiPort') private readonly geminiPort: GeminiPort,
    @Inject('QdrantPort') private readonly qdrantPort: QdrantPort,
    @Inject('ExpressionPort') private readonly expressionPort: ExpressionPort,
  ) {}

  private async delay(ms: number) {
    // 지수적 백오프 방식 (Exponential Backoff)적용
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private toEntity(dto: any): ExpressionEntity {
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

  async generateAndSaveUniqueExpressions(): Promise<string[]> {
    const results: string[] = [];
    let totalSaved = 0;
//TODO 중복 표현 테이블에 중복인 표현 저장하기
    while (true) {
      const expressions = await this.geminiPort.getExpressions('');

      for (const exp of expressions) {
        const similarity = await this.qdrantPort.searchSimilar(exp.expression);
        if (similarity > 0.9) {
          const blacklisted = await this.expressionPort.saveExpressionBlackList(exp.expression);
          results.push(`⚠️ 중복 스킵: ${blacklisted.expression}`);
          continue;
        }

        const entity = this.toEntity(exp);
        const saved = await this.expressionPort.save(entity);
        await this.qdrantPort.insertEmbedding(saved.e_id, saved.expression);
        results.push(`✅ 저장 완료: ${saved.expression}`);
        totalSaved++;

        if (totalSaved >= 3) {
          return results;
        }
      }

      // 3개 미만 저장되었으면 다시 요청
      console.log('🔁 저장된 표현이 부족하여 20초 후 재요청합니다...');
      await this.delay(20000);
    }
  }
}
