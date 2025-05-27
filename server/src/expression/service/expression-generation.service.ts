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
    console.log('✅ Batch Expression Generation started');
  
    let savedCount = 0;
  
    for (let attempt = 0; attempt < this.MAX_RETRY; attempt++) {
      const candidates = await this.aiService.getExpressionFromGPT();
  
      for (const exp of candidates) {
        const similarity = await this.qdrant.searchSimilar(exp.expression);
        if (similarity > 0.9) {
          console.log(`⚠️ 중복 표현 스킵: ${exp.expression}`);
          continue;
        }
  
        const saved = await this.expressionPort.save(exp);
        await this.qdrant.insertEmbedding(saved.e_id, exp.expression);
        console.log(`✅ ${saved.e_id} 저장 완료: ${exp.expression}`);
  
        savedCount++;
      }
  
      if (savedCount >= this.TARGET_COUNT) {
        console.log(`🎉 ${savedCount}개 표현 저장 완료`);
        return;
      }
  
      console.log(`🔁 아직 ${savedCount}/${this.TARGET_COUNT} 저장됨 → GPT 재요청`);
    }
  
    console.warn(`❗최대 ${this.MAX_RETRY}회 시도했지만 ${savedCount}개만 저장됨`);
  }
  
}
