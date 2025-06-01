// src/ai/ai.controller.ts
import { Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { OpenAiService } from '../../service/openAi.service';
import { QdrantAdapter } from '../../adapter/out/qdrant.adapter';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: OpenAiService,
    @Inject('QdrantPort')
    private readonly qdrant: QdrantAdapter, 
  ) {}

  @Get('test')
  async testGenerate() {
    //const result = await this.aiService.generateAndSaveIfUnique();
    //console.log('GPT 응답 결과:', result);
    //return { expressions: result };
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