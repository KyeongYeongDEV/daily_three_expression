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
      model: 'gemini-1.5-flash-latest', 
      tools: geminiTools,
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingMode.ANY, 
          allowedFunctionNames: ['returnExpressions'], 
        },
      },
    });
  }

  async getExpressions(userRequest: string = ''): Promise<any> {
    try {
      const systemPrompt = this.configService.get<string>('SYSTEM_INSTRUCTION') || '';
      const userPrompt = this.configService.get<string>('USER_PROMPT') || '';
      const prompt = `${systemPrompt}\n${userPrompt}${userRequest ? ` ${userRequest}` : ''}`.trim();

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