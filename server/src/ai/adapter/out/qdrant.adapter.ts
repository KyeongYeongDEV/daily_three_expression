import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { AiService } from "src/ai/service/ai.service";
import { ExpressionPort } from "src/expression/port/expression.port";
import { ExpressionEntity } from "src/expression/domain/expression.entity";

@Injectable()
export class QdrantAdapter implements QdrantPort {
  private readonly COLLECTION = 'expressions';

  constructor(
    private readonly httpService: HttpService,
    private readonly aiService: AiService,
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
  ) {}

  async insertEmbedding(id: number, text: string): Promise<void> {
    const vector = await this.aiService.getEmbedding(text);
    if (!vector || vector.length === 0) return;

    const payload = {
      points: [
        {
          id,
          vector,
          payload: { id },
        },
      ],
    };

    await firstValueFrom(
      this.httpService.put(
        `http://localhost:6333/collections/${this.COLLECTION}/points`,
        payload
      )
    );
  }

  async trySaveIfNotSimilar(expression: ExpressionEntity): Promise<string> {
    const similarity = await this.searchSimilar(expression.expression);
    if (similarity > 0.9) {
      console.warn(`중복 표현 스킵: ${expression.expression}`);
      const result = await this.expressionPort.saveExpressionBlackList(expression.expression);
      console.log('saveExpressionBlackList 결과:', result);
      return result.expression;
    }
    

    const saved = await this.expressionPort.save(expression);
    await this.insertEmbedding(saved.e_id, expression.expression);
    console.log(`✅ ${saved.e_id} 저장 완료: ${expression.expression}`);
    return `✅ 저장됨: ${expression.expression}`;
  }

  async searchSimilar(text: string): Promise<number> {
    const vector = await this.aiService.getEmbedding(text);
    if (!vector || vector.length === 0) return 0;

    const payload = {
      vector,
      limit: 1,
      with_payload: false,
    };

    const res = await firstValueFrom(
      this.httpService.post(
        `http://localhost:6333/collections/${this.COLLECTION}/points/search`,
        payload
      )
    );

    return res.data.result?.[0]?.score ?? 0;
  }

  async syncAllExpressionsToQdrant(): Promise<void> {
    const expressions = await this.expressionPort.findAll();

    for (const exp of expressions) {
      const embedding = await this.aiService.getEmbedding(exp.expression);
      if (!embedding || embedding.length === 0) continue;

      const payload = {
        points: [
          {
            id: exp.e_id,
            vector: embedding,
            payload: { id: exp.e_id },
          },
        ],
      };

      await firstValueFrom(
        this.httpService.put(
          `http://localhost:6333/collections/${this.COLLECTION}/points`,
          payload
        )
      );

      console.log(`✅ Qdrant 업로드 완료: ${exp.e_id}`);
    }

    console.log(`총 ${expressions.length}개 표현 동기화 완료`);
  }

  async deleteAllPoints(): Promise<void> {
    const payload = {
      filter: {
        must: [], // 전체 삭제
      },
    };

    await firstValueFrom(
      this.httpService.post(
        `http://localhost:6333/collections/${this.COLLECTION}/points/delete`,
        payload
      )
    );

    console.log(`Qdrant '${this.COLLECTION}' 컬렉션 전체 삭제 완료`);
  }
}
