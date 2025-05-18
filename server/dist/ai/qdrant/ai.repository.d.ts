import { DataSource } from 'typeorm';
export declare class AiRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    saveExpression(expression: string, vector: number[]): Promise<void>;
}
