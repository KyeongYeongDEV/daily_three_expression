export interface OpenAiPort {
  getExpressionFromGPT(): Promise<any[]>;
  getEmbedding(text: string): Promise<number[]> ;
}