export interface QdrantPort {
  searchSimilar(text: string): Promise<number>; 
  insertEmbedding(id: number, text: string): Promise<void>; 
}