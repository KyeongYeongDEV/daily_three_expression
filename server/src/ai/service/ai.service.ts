import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { functions } from '../../common/helpers/openAI.helper';
import { OpenAiPort } from '../port/out/openai.port';


@Injectable()
export class AiService  implements OpenAiPort {
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.openAi = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }
  
  private openAi: OpenAI;
  
  async getExpressionFromGPT(): Promise<any[]> {
    try {
      const content = this.configService.get<string>('OPENAI_CONTENT') as string;
      const prompts = this.configService.get<string>('OPENAI_PROMPT') as string;

      function decodeUnicode(str: string): string {
        return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
          String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
        );
      }

      
      const completion = await this.openAi.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content:content,
          },
          { role: 'user', content: prompts },
        ],
        functions,
        function_call: { name: 'returnExpressions' },
      });

      let response = completion.choices[0].message?.function_call?.arguments ?? '{}';
      console.log(response);

    
      response = decodeUnicode(response);
      const parsed = JSON.parse(response);
      return parsed.expressions ?? [];
    } catch (error) {
      console.error('❌ JSON 파싱 실패 (function call 응답):');
      return [];
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    try{
      if (typeof text !== 'string' || !text.trim()) {
        throw new Error(`❌ getEmbedding input 오류: '${text}'`);
      }
  
      const result = await this.openAi.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
  
      return result.data[0].embedding;
    } catch ( error ) {
      return [];
    }
  }
}
