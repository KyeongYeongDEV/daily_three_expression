import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AiRepository {
  constructor(private readonly dataSource: DataSource) {}

  async checkDuplicate(vector: number[]): Promise<boolean> {
    const rows = await this.dataSource.query('SELECT expression, embedding FROM expression_embeddings');

    for (const row of rows) {
      const existing = JSON.parse(row.embedding);
      const similarity = this.cosineSimilarity(existing, vector);
      if (similarity > 0.9) return true;
    }
    return false;
  }

  async saveExpression(expression: string, vector: number[]): Promise<void> {
    await this.dataSource.query(
      'INSERT INTO expression_embeddings (expression, embedding) VALUES (?, ?)',
      [expression, JSON.stringify(vector)],
    );
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
  }
}
