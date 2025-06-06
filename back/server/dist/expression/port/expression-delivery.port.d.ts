import { ExpressionResponseDto } from '../dto/response.dto';
export declare const EXPRESSION_DELIVERY_PORT: unique symbol;
export interface ExpressionDeliveryPort {
    findDeliveriedExpressionsByUid(id: number): Promise<ExpressionResponseDto[]>;
    findStartExpressionId(): Promise<number>;
    saveExpressionDeliveried(u_id: number, e_id: number, deliveryStatus: string): Promise<void>;
}
