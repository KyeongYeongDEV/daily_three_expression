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
        { role: 'system', content: 'You must ONLY respond with a JSON array of 3 English expressions. No explanation.' },
        { role: 'user', content: prompt },
      ],
    });
  
    const response = completion.choices[0].message?.content;
  
    try {
      return JSON.parse(response ?? '[]');
    } catch (e) {
      console.error('❌ JSON 파싱 실패! GPT 응답:', response);
      return [];
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const result = await this.openAi.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return result.data[0].embedding;
  }
}
