const functions = [
  {
    name: 'returnExpressions',
    description: 'Return 5 English pattern expressions with translation, examples, and usage in Korean.',
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

export { functions }