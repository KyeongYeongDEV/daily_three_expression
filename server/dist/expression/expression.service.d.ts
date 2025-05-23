import { ExpressionPort } from './port/expression.port';
import { ExpressionDeliveryPort } from './port/expression-delivery.port';
import { ExpressionEntity } from './entities/expression.entity';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';
export declare class ExpressionService {
    private readonly expressionPort;
    private readonly expressionDeliveryPort;
    constructor(expressionPort: ExpressionPort, expressionDeliveryPort: ExpressionDeliveryPort);
    getAllExpressions(): Promise<ExpressionListResponse>;
    getExpressionById(id: number): Promise<ExpressionResponse>;
    getThreeExpressionsByStartId(id: number): Promise<ExpressionListResponse>;
    getThreeExpressionsByStartIdAndCategory(id: number, category: string): Promise<ExpressionListResponse>;
    getDeliveriedExpressionsByUid(id: number): Promise<ExpressionListResponse>;
    createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity>;
}
