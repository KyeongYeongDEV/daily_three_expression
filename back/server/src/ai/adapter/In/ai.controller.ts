import { Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { OpenaiAdapter } from '../../adapter/out/openai.adapter';
import { QdrantAdapter } from '../../adapter/out/qdrant.adapter';
import { AiService } from '../../service/ai.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly openAiAdapter: OpenaiAdapter,
    private readonly aiservice : AiService,
    @Inject('QdrantPort')
    private readonly qdrant: QdrantAdapter, 
  ) {}

  @Get('test')
  async testGenerate() {
    console.log('🔥 표현 생성 controller 실행');
    const result = await this.aiservice.generateAndSaveUniqueExpressions();
    console.log('🔥 Gemini 응답 결과:', result);
    return { expressions: result };
  }

  @Post('save/all/expressions')
  async syncAllExpressionsToQdrant() {
    this.qdrant.syncAllExpressionsToQdrant();
    return { message: '모든 표현식이 Qdrant에 동기화되었습니다.' };
  }

  @Post('generate')
  async generateUniqueExpressions() {
    //TODO 
  }

  @Delete('all/expressions')
  async deleteAllExpressionsFromQdrant() {
    await this.qdrant.deleteAllPoints();
    return { message: '모든 표현식이 Qdrant에서 삭제되었습니다.' };
  }
}