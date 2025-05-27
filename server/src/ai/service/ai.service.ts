import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { functions } from '../../common/helpers/openAI.helper';
import { OpenAiPort } from '../port/out/openai.port';
import { ExpressionPort } from 'src/expression/port/expression.port';

@Injectable()
export class AiService implements OpenAiPort {
  private openAi: OpenAI;

  constructor(
    @Inject('ExpressionPort')
    private readonly expressionPort: ExpressionPort,
    private readonly configService: ConfigService
  ) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getExpressionFromGPT(): Promise<any[]> {
    try {
      const content = this.configService.get<string>('OPENAI_CONTENT')!;
      let prompt = this.configService.get<string>('OPENAI_PROMPT')!;
  
      // ⬇️ 중복 표현 상위 5개 받아오기
      const blacklist = await this.expressionPort.findTop5BlacklistedExpressions();
      if (blacklist.length > 0) {
        const exclusions = blacklist.map(exp => `- "${exp}"`).join('\n');
        prompt += `Absolutely avoid using any of the following expressions:\n${exclusions}`;
      }
  
      const completion = await this.openAi.chat.completions.create({
        model: 'gpt-4-1106-preview',
        temperature: 0.7,
        messages: [
          { role: 'system', content },
          { role: 'user', content: prompt },
        ],
        functions,
        function_call: { name: 'returnExpressions' },
      });
  
      let raw = completion.choices[0].message?.function_call?.arguments ?? '{}';
  
      const cleaned = raw
        .replace(/\\n/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\u[\dA-F]{4}/gi, '')
        .trim();
  
      const parsed = JSON.parse(cleaned);
  
      const validExpressions = (parsed.expressions ?? []).filter((e: any) =>
        e.translation_expression?.trim() &&
        e.translation_example1?.trim() &&
        e.translation_example2?.trim()
      );
  
      console.log('✅ GPT 응답 파싱 성공:', validExpressions);
      return validExpressions;
    } catch (error) {
      console.error('❌ GPT 응답 파싱 실패:', error instanceof Error ? error.message : error);
      return [];
    }
  }
  async getEmbedding(text: string): Promise<number[]> {
    try {
      if (typeof text !== 'string' || !text.trim()) {
        throw new Error(`❌ getEmbedding input 오류: '${text}'`);
      }

      const result = await this.openAi.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return result.data[0].embedding;
    } catch (error) {
      console.error('❌ 임베딩 실패:', error);
      return [];
    }
  }
}
