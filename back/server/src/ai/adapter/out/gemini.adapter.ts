import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel, FunctionCall } from '@google/generative-ai'; // ✨ FunctionCall 타입도 임포트합니다.
import { IGeminiAdapter } from '../../port/out/gemini.port';
import { geminiTools } from '../../../common/helpers/gemini.helper';
import { ReturnExpressionsFunctionArgs } from 'src/common/interfaces/expression.interface';

const SYSTEM_INSTRUCTION = `You are an experienced English conversation teacher. Return ONLY a clean valid JSON object for Korean learners with these fields: category, expression, example1, example2, translation_expression, translation_example1, translation_example2. All Korean translations MUST be full natural Korean sentences. Do not include ellipses (...), \\n, \\uXXXX, or explanations. No greetings or preamble.`;

const USER_PROMPT = `Return exactly 5 English pattern expressions using \`returnExpressions\` function. Include: category, expression, example1, example2, translation_expression, translation_example1, translation_example2. All Korean translations must be full, natural sentences. Do NOT use "...", "\\n", or empty fields. Do NOT explain or greet.`;


@Injectable()
export class GeminiAdapter implements IGeminiAdapter {
  private model: GenerativeModel;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables.');
    }
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async getExpressions(userRequest: string = ''): Promise<any> {
    try {
      const chat = this.model.startChat({
        tools: geminiTools,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await chat.sendMessage(USER_PROMPT + (userRequest ? ` ${userRequest}` : ''));

      const call = result.response.functionCall();
      if (call && call.name === 'returnExpressions') {
        const args = call.args as ReturnExpressionsFunctionArgs;
        return args.expressions; 
      } else {
        const textResponse = result.response.text();
        console.warn('Gemini did not return a function call. Raw text response:', textResponse);
        throw new Error('Gemini did not return the expected function call for expressions.');
      }
    } catch (error) {
      console.error('Error in GeminiAdapter:', error);
      throw new Error(`Failed to get expressions from Gemini API: ${error.message}`);
    }
  }
}