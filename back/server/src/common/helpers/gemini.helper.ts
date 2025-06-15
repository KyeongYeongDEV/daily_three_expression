import { Tool, SchemaType } from '@google/generative-ai';

const geminiTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'returnExpressions',
        description: 'Returns exactly 5 English pattern expressions with natural Korean translations. ⚠ Translations must be full sentences in Korean. Never include "...", "\\n", "\\uXXXX", or empty strings.',
        parameters: {
          type: SchemaType.OBJECT, 
          properties: {
            expressions: {
              type: SchemaType.ARRAY, 
              minItems: 5,
              maxItems: 5,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  category: { type: SchemaType.STRING, description: 'Pattern type. e.g., Apology, Request, Gratitude.' }, 
                  expression: { type: SchemaType.STRING, description: 'The English pattern phrase (e.g., "I’m sorry for...").' },
                  example1: { type: SchemaType.STRING, description: 'First full English sentence using the expression.' },
                  example2: { type: SchemaType.STRING, description: 'Second full English sentence using the expression.' },
                  translation_expression: { type: SchemaType.STRING, description: '한국어 번역. 반드시 완전한 자연스러운 문장이어야 하며, 생략부호(...)나 줄바꿈 기호(\\n), 유니코드(\\uXXXX) 사용 금지.' },
                  translation_example1: { type: SchemaType.STRING, description: 'example1의 완전한 한국어 번역.' },
                  translation_example2: { type: SchemaType.STRING, description: 'example2의 완전한 한국어 번역.' },
                },
                required: [
                  'category', 'expression', 'example1', 'example2',
                  'translation_expression', 'translation_example1', 'translation_example2',
                ]
              }
            }
          },
          required: ['expressions']
        }
      }
    ],
  },
];

export { geminiTools };