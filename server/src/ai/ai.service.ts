import { Injectable } from '@nestjs/common';
import { AiRepository } from './ai.repository';
import OpenAI from 'openai'; 
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private openAi: OpenAI;

  constructor(
    private readonly aiRepository: AiRepository,
    private readonly configService: ConfigService,
  ) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateAndSaveIfUnique(prompt: string): Promise<string[]> {
    const expressions = await this.generateFromGPT(prompt);
    const results: string[] = [];

    for (const expression of expressions) {
      const vector = await this.getEmbedding(expression);
      const isDup = await this.aiRepository.checkDuplicate(vector);
      if (!isDup) {
        await this.aiRepository.saveExpression(expression, vector);
        results.push(expression);
      }
    }

    return results;
  }

  private async generateFromGPT(prompt: string): Promise<string[]> {
    const completion = await this.openAi.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are the best English conversation teacher' }, // 프롬프트 설정
        { role: 'user', content: prompt }, //  내 질문
      ],
    });

    const response = completion.choices[0].message?.content;
    return JSON.parse(response ?? '[]');
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const result = await this.openAi.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return result.data[0].embedding;
  }
}
