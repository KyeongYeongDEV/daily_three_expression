export interface IGeminiAdapter {
  getExpressions(userPrompt: string): Promise<any>;
}