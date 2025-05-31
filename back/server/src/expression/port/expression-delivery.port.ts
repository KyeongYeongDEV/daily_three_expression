import { ExpressionResponseDto } from '../dto/response.dto';

export const EXPRESSION_DELIVERY_PORT = Symbol('ExpressionDeliveryPort');

export interface ExpressionDeliveryPort {
  findDeliveriedExpressionsByUid(id: number): Promise<ExpressionResponseDto[]>;
}
