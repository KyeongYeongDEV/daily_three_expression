import { Repository } from 'typeorm';
import { ExpressionEntity } from '../entities/expression.entity';
export declare class ExpressionRepository {
    private readonly orm;
    constructor(orm: Repository<ExpressionEntity>);
    save(expression: ExpressionEntity): Promise<ExpressionEntity>;
    findAll(): Promise<ExpressionEntity[]>;
    findById(id: number): Promise<ExpressionEntity | null>;
    findThreeExpressionsByStartIdAndCategory(startId: number, category: string): Promise<ExpressionEntity[] | null>;
    findThreeExpressionsByStartId(startId: number): Promise<ExpressionEntity[] | null>;
    findByCategory(category: string): Promise<ExpressionEntity | null>;
}
