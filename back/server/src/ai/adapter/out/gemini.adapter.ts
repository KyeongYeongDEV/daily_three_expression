import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, FunctionCallingMode } from '@google/generative-ai';
import { GeminiPort } from '../../port/out/gemini.port';
import { geminiTools } from '../../../common/helpers/gemini.helper';

@Injectable()
export class GeminiAdapter implements GeminiPort, OnModuleInit {
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not configured.');
    }
  
    const genAI = new GoogleGenerativeAI(apiKey);
  
    this.model = genAI.getGenerativeModel({
      //model: 'gemini-1.5-pro-latest', // pro는 유료임 
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.95,
        topK: 100,
        topP: 0.98,
      },
      tools: geminiTools,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.ANY,
          allowedFunctionNames: ['returnExpressions'],
        },
      },
    });
  }
  

  async getExpressions(blacklist: string[]): Promise<any> {
    try {
      const systemPrompt = this.configService.get<string>('SYSTEM_INSTRUCTION') || '';
      const userPrompt = this.configService.get<string>('USER_PROMPT') || '';
      const blacklistText = blacklist.length
        ? `\nDo NOT include the following expressions:\n${blacklist.map(e => `- ${e}`).join('\n')}`
        : '';

      const prompt = `${systemPrompt}\n${userPrompt}${blacklistText}`.trim();

      const result = await this.model.generateContent(prompt);
      const response = result.response;

      const toolCalls = response.functionCalls();
      if (!toolCalls || toolCalls.length === 0) {
        throw new Error('Gemini did not return a function call.');
      }

      const firstToolCall = toolCalls[0];
      if (firstToolCall.name !== 'returnExpressions') {
        throw new Error(`Unexpected function call: ${firstToolCall.name}`);
      }

      const args = firstToolCall.args as { expressions: any[] };
      const expressions = args.expressions;
      if (!expressions) {
        throw new Error('Parsed result does not contain expressions field.');
      }

      return expressions;
    } catch (error: any) {
      console.error('🔥 Error in GeminiAdapter:', error.response?.data || error.message);
      throw error;
    }
  }
}
