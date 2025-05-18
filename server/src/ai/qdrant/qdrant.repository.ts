import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class QdrantRepository {
  constructor(private readonly dataSource: DataSource) {}

  async saveExpression(expression: string, vector: number[]): Promise<void> {
    
  }

  async deleteExpressionById(id : number) : Promise<void> {
    
  }

}
