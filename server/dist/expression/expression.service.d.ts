import { ExpressionRepository } from './expression.repository';
import { Expression } from './entities/expression.entity';
export declare class ExpressionService {
    private readonly expressionRepository;
    constructor(expressionRepository: ExpressionRepository);
    getAllExpressions(): Promise<Expression[]>;
    createNewExpression(input: Expression): Promise<Expression>;
}
