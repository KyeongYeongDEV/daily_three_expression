import { Injectable } from '@nestjs/common';
import { AiRepository } from './ai.repository';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

function decodeUnicode(str: string): string {
  return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
  );
}

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

  async generateAndSaveIfUnique(): Promise<string[]> {
    const expressions = await this.generateFromGPT();
    const results: string[] = [];

    if (!Array.isArray(expressions)) {
      console.error('❗ GPT 응답이 배열이 아닙니다:', expressions);
      return [];
    }

    for (const expression of expressions) {
      const text = expression.expression ?? expression;
      const vector = await this.getEmbedding(text);
      const isDup = await this.aiRepository.checkDuplicate(vector);
      if (!isDup) {
        await this.aiRepository.saveExpression(expression, vector);
        results.push(text);
      }
    }

    return results;
  }

  private async generateFromGPT(): Promise<any[]> {
    const discriptions = this.configService.get<string>('OPENAI_DESCRIPTION') as string;
    const content = this.configService.get<string>('OPENAI_CONTENT') as string;
    const prompts = this.configService.get<string>('OPENAI_PROMPT') as string;
    

    const functions = [
      {
        name: 'returnExpressions',
        description: discriptions,
        parameters: {
          type: 'object',
          properties: {
            expressions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  expression: { type: 'string' },
                  example1: { type: 'string' },
                  example2: { type: 'string' },
                  translation_expression: { type: 'string' },
                  translation_example1: { type: 'string' },
                  translation_example2: { type: 'string' },
                },
                required: [
                  'category',
                  'expression',
                  'example1',
                  'example2',
                  'translation_expression',
                  'translation_example1',
                  'translation_example2'
                ],
              },
            },
          },
          required: ['expressions'],
        },
      },
    ];

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

    try {
      response = decodeUnicode(response);
      const parsed = JSON.parse(response);
      return parsed.expressions ?? [];
    } catch (e) {
      console.error('❌ JSON 파싱 실패 (function call 응답):', response);
      return [];
    }
  }

  private async getEmbedding(text: string): Promise<number[]> {
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error(`❌ getEmbedding input 오류: '${text}'`);
    }

    const result = await this.openAi.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return result.data[0].embedding;
  }
}
