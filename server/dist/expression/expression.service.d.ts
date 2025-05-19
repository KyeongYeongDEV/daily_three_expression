import { ExpressionRepository } from './repository/expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ExpressionListResponse, ExpressionResponse } from 'src/common/types/response.type';
import { ExpressionDeliveryRepository } from './repository/expression-delivery.repository';
export declare class ExpressionService {
    private readonly expressionRepository;
    private readonly expressionDeliveryRepository;
    constructor(expressionRepository: ExpressionRepository, expressionDeliveryRepository: ExpressionDeliveryRepository);
    getAllExpressions(): Promise<ExpressionListResponse>;
    getExpressionById(id: number): Promise<ExpressionResponse>;
    getThreeExpressionsByStartId(id: number): Promise<ExpressionListResponse>;
    getThreeExpressionsByStartIdAndCategory(id: number, category: string): Promise<ExpressionListResponse>;
    getDeliveriedExpressionsByUid(id: number): Promise<ExpressionListResponse>;
    createNewExpression(input: ExpressionEntity): Promise<ExpressionEntity>;
}
