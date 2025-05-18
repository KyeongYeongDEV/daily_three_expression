import { Repository } from 'typeorm';
import { Expression } from './entities/expression.entity';
export declare class ExpressionRepository {
    private readonly expressionRepository;
    constructor(expressionRepository: Repository<Expression>);
    findAll(): Promise<Expression[]>;
    save(expression: Expression): Promise<Expression>;
    findById(id: number): Promise<Expression | null>;
    findByCategory(category: string): Promise<Expression | null>;
}
