import { Inject, Injectable } from "@nestjs/common";
import { AiService } from "../../ai/service/ai.service";
import { ExpressionPort } from "src/expression/port/expression.port";
import { QdrantPort } from "../../ai/port/out/qdrant.port";

@Injectable()
export class ExpressionGenerationService {
  constructor(
    private readonly aiService: AiService, // TODO OpenaiPort로 변경할 것
    @Inject('ExpressionPort') 
    private readonly expressionPort: ExpressionPort,
    @Inject('QdrantPort')
    private readonly qdrant: QdrantPort, 
  ) {}

  private readonly MAX_RETRY = 10;
  private readonly TARGET_COUNT = 3;

  async runExpressionGenerationBatch(): Promise<void> {
    let savedCount = 0;

    for (let i = 0; i < this.MAX_RETRY && savedCount < this.TARGET_COUNT; i++) {
      const candidates = await this.aiService.getExpressionFromGPT();

      for (const exp of candidates) {
        const similarity = await this.qdrant.searchSimilar(exp.expression);
        if (similarity > 0.9) continue;
        
        const saved = await this.expressionPort.save(exp);
        await this.qdrant.insertEmbedding(saved.e_id, exp.expression);
        console.log(`✅ ${saved.e_id} 저장 완료: ${exp.expression}`);

        savedCount++;
        if (savedCount >= this.TARGET_COUNT) break;
      }
    }

    if (savedCount < this.TARGET_COUNT) {
      console.warn(`❗최대 시도 후 ${savedCount}개만 저장됨`);
    } else {
      console.log('✅ 3개 이상 저장 완료, 프로세스 종료');
    }
  }
}
