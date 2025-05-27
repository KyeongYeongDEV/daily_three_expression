import { ExpressionEntity } from "src/expression/domain/expression.entity";

export interface QdrantPort {
  searchSimilar(text: string): Promise<number>; 
  insertEmbedding(id: number, text: string): Promise<void>; 
  syncAllExpressionsToQdrant(): Promise<void>;
  deleteAllPoints(): Promise<void>;
  trySaveIfNotSimilar(expression: ExpressionEntity): Promise<string>;
}