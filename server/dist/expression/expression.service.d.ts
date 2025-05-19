import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ExpressionListResponse } from 'src/common/types/response.type';
export declare class ExpressionService {
    private readonly expressionRepository;
    constructor(expressionRepository: ExpressionRepository);
    getAllExpressions(): Promise<ExpressionListResponse>;
    createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity>;
}
