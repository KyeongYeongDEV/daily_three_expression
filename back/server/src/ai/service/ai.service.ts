import { Inject, Injectable } from '@nestjs/common';
import { GeminiPort } from '../port/out/gemini.port';
import { QdrantPort } from '../port/out/qdrant.port';
import { ExpressionPort } from '../../expression/port/expression.port';
import { ExpressionEntity } from '../../expression/domain/expression.entity';
import { WebhookService } from '../../common/service/webhook.service';

@Injectable()
export class AiService {
  constructor(
    @Inject('GeminiPort')
    private readonly geminiPort: GeminiPort,
    @Inject('QdrantPort')
    private readonly qdrantPort: QdrantPort,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    private readonly webhookService: WebhookService,
  ) {}

  private async delay(ms: number) {
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

  private includesExpression(example: string, expression: string): boolean {
    return example.toLowerCase().includes(expression.toLowerCase().replace(/\.{3}$/, '').trim());
  }

  private normalizeExpression(expression: string): string {
    return expression
      .toLowerCase()
      .replace(/\.{3}$/, '')
      .replace(/[^a-z]/g, '')
      .trim();
  }

  private wordCount(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private async sendWebhookMessage(results: string[], expressions: any[]): Promise<void> {
    try {
      const savedExpressions = expressions
        .filter(e => results.find(msg => msg.includes(e.expression) && msg.includes('✅')))
        .map(e => `✅ **${e.expression}**
      - ex1: ${e.example1}
      - ex2: ${e.example2}`)
        .join('\n\n');

      const skippedExpressions = results
        .filter(msg => msg.startsWith('⚠️') || msg.startsWith('❌'))
        .join('\n');

      const finalMessage = `🔥 Gemini 응답 결과:\n\n${savedExpressions}\n\n${skippedExpressions}`;

      await this.webhookService.sendMessage(finalMessage);
    } catch (error) {
      console.error('Webhook 전송 중 오류 발생:', error);
    }
  }

  async generateAndSaveUniqueExpressions(): Promise<string[]> {
    try {
      console.log('🔥 표현 생성 시작 - ai.service의 메소드임');
      const results: string[] = [];
      let totalSaved = 0;
      const blacklist = await this.expressionPort.findTop20BlacklistedExpressions();

      while (true) {
        console.log('생성 시작됨')
        const expressions = await this.geminiPort.getExpressions(blacklist);

        for (const exp of expressions) {
          if (exp.expression.length < 10) {
            results.push(`❌ 표현 너무 짧음 → ${exp.expression}`);
            continue;
          }

          const isIncluded1 = this.includesExpression(exp.example1, exp.expression);
          const isIncluded2 = this.includesExpression(exp.example2, exp.expression);

          if (!isIncluded1 || !isIncluded2) {
            results.push(`❌ 예시 포함 안 됨 → 블랙리스트: ${exp.expression}`);
            continue;
          }

          if (this.wordCount(exp.example1) < 6 || this.wordCount(exp.example2) < 6) {
            results.push(`❌ 예시 문장 너무 짧음 → ${exp.expression}`);
            continue;
          }

          const similarity = await this.qdrantPort.searchSimilar(exp.expression);

          const normalizedExpression = this.normalizeExpression(exp.expression);
          const isTextuallyOverlapping = blacklist.some(black =>
            this.normalizeExpression(black).includes(normalizedExpression) ||
            normalizedExpression.includes(this.normalizeExpression(black))
          );

          if (similarity > 0.95 || isTextuallyOverlapping) {
            const blacklisted = await this.expressionPort.saveExpressionBlackList(exp.expression);
            results.push(`⚠️ 중복 스킵: ${blacklisted.expression}`);
            continue;
          }

          const entity = this.toEntity(exp);
          const saved = await this.expressionPort.save(entity);
          await this.qdrantPort.insertEmbedding(saved.e_id, saved.expression);
          results.push(`✅ 저장 완료: ${saved.expression}`);
          totalSaved++;
        }

        if (totalSaved >= 3) {
          await this.sendWebhookMessage(results, expressions);
          return results;
        }

        console.log(`현재 저장된 수 : ${totalSaved} | 저장된 표현이 부족하여 20초 후 재요청합니다...`);
        await this.delay(20000);
      }
    } catch (error) {
      console.error('Expression generation failed:', error);
      throw error;
    }
  }
}