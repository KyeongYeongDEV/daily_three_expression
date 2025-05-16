// src/ai/ai.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('test')
  async testGenerate(@Query('prompt') prompt: string) {
    const result = await this.aiService.generateAndSaveIfUnique(prompt);
    console.log('GPT 응답 결과:', result);
    return { expressions: result };
  }
}
