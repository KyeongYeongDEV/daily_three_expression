import { DataSource } from 'typeorm';
export declare class AiRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    checkDuplicate(vector: number[]): Promise<boolean>;
    saveExpression(expression: string, vector: number[]): Promise<void>;
    private cosineSimilarity;
}
