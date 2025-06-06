import { ExpressionResponseDto } from '../dto/response.dto';

export const EXPRESSION_DELIVERY_PORT = Symbol('ExpressionDeliveryPort');

export interface ExpressionDeliveryPort {
  findDeliveriedExpressionsByUid(id: number): Promise<ExpressionResponseDto[]>;
  findStartExpressionId() : Promise<number>;
  saveExpressionDeliveried(u_id : number, e_id : number, deliveryStatus: string): Promise<void>;
}
