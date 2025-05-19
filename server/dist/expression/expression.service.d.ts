import { ExpressionRepository } from './expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';
export declare class ExpressionService {
    private readonly expressionRepository;
    constructor(expressionRepository: ExpressionRepository);
    getAllExpressions(): Promise<ExpressionListResponse>;
    getExpressionById(id: number): Promise<ExpressionResponse>;
    createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity>;
}
