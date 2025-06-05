import { ExpressionResponseDto } from '../dto/response.dto';
export declare const EXPRESSION_DELIVERY_PORT: unique symbol;
export interface ExpressionDeliveryPort {
    findDeliveriedExpressionsByUid(id: number): Promise<ExpressionResponseDto[]>;
    findStartExpressionId(startDay: Date, yesterday: Date): Promise<number>;
}
