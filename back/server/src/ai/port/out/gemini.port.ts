export interface GeminiPort {
  getExpressions(userPrompt: string): Promise<any>;
}