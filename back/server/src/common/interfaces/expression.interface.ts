export interface GeneratedExpression {
  category: string;
  expression: string;
  example1: string;
  example2: string;
  translation_expression: string;
  translation_example1: string;
  translation_example2: string;
}

export interface ReturnExpressionsFunctionArgs {
  expressions: GeneratedExpression[];
}

export interface StorableExpression extends GeneratedExpression {
  id: string; 
}