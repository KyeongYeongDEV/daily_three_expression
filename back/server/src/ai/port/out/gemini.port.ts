export interface GeminiPort {
  getExpressions(blacklist: string[]): Promise<any>;
}