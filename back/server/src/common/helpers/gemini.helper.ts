// 1. FunctionDeclarationSchema 타입을 추가로 import 합니다.
import { Tool, FunctionDeclarationSchema } from '@google/generative-ai';

// 2. parameters 객체의 타입을 명시적으로 선언합니다.
const returnExpressionsParams: FunctionDeclarationSchema = {
  type: "object",
  properties: {
    expressions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: 'Pattern type. e.g., Apology, Request, Gratitude.'
          },
          expression: {
            type: "string",
            description: 'The English pattern phrase (e.g., "I’m sorry for..."). This phrase must be used naturally in both example1 and example2, but should not be exactly repeated as-is.'
          },
          example1: {
            type: "string",
            description: 'First full English sentence that includes the expression naturally. ⚠ Must not be identical to the expression itself.'
          },
          example2: {
            type: "string",
            description: 'Second full English sentence that also includes the expression, but in a different context than example1. ⚠ Must not be a duplicate.'
          },
          translation_expression: {
            type: "string",
            description: '한국어 번역. 반드시 완전한 자연스러운 문장이어야 하며, 생략부호(...)나 줄바꿈 기호(\\n), 유니코드(\\uXXXX) 사용 금지.'
          },
          translation_example1: {
            type: "string",
            description: 'example1의 완전한 한국어 번역.'
          },
          translation_example2: {
            type: "string",
            description: 'example2의 완전한 한국어 번역.'
          },
        },
        required: [
          'category', 'expression', 'example1', 'example2',
          'translation_expression', 'translation_example1', 'translation_example2',
        ]
      }
    }
  },
  required: ['expressions']
};

const geminiTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'returnExpressions',
        description: 'Returns exactly 5 English pattern expressions with natural Korean translations. ⚠ Translations must be full sentences in Korean. Never include "...", "\\n", "\\uXXXX", or empty strings.',
        // 3. 타입이 명시된 객체를 사용합니다.
        parameters: returnExpressionsParams,
      }
    ],
  },
];

export { geminiTools };