import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
export declare class ExpressionService {
    private readonly expressionRepository;
    constructor(expressionRepository: ExpressionRepository);
    getAllExpressions(): Promise<ExpressionEntity[] | string>;
    createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity>;
}
