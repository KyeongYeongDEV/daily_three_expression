// src/ai/ai.controller.ts
import { Controller, Get, Post, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('test')
  async testGenerate() {
    //const result = await this.aiService.generateAndSaveIfUnique();
    //console.log('GPT 응답 결과:', result);
    //return { expressions: result };
  }

  @Post('generate')
  async generateUniqueExpressions() {
    //TODO 
  }
}