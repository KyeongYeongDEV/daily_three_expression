import { DataSource } from 'typeorm';
export declare class QdrantRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    saveExpression(expression: string, vector: number[]): Promise<void>;
    deleteExpressionById(id: number): Promise<void>;
}
