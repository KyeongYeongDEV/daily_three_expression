import { Inject, Injectable } from '@nestjs/common';
import { EXPRESSION_DELIVERY_PORT, ExpressionDeliveryPort } from '../port/expression-delivery.port';

@Injectable()
export class ExpressionDeliveryService {
  constructor(
    @Inject(EXPRESSION_DELIVERY_PORT)
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {}

  private getYesterdayAndStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    return { today, yesterday };
  } 
  //TOOD return type 변경
  async findStartExpressionId() {
    try {
      const {today, yesterday} = this.getYesterdayAndStart();
      const result = await this.expressionDeliveryPort.findStartExpressionId();

      if (result === 0) {
        throw new Error('[findStartExpressionId] 조회된 표현이 없습니다.');
      }

      return result;
    } catch (error) {
      console.error('[ExpressionDeliveryService] findStartExpressionId 에러:', error);
      throw new Error('표현 시작 ID 조회 중 오류가 발생했습니다.'); 
    }
  }
  
  async findDeliveriedExpressionsByUid(u_id: number) {
    try {
      const expressions = await this.expressionDeliveryPort.findDeliveriedExpressionsByUid(u_id);

      if (!expressions || expressions.length === 0) {
        throw new Error('[findDeliveriedExpressionsByUid] 해당 사용자에게 전달된 표현이 없습니다.');
      }

      return expressions;
    } catch (error) {
      console.error('[ExpressionDeliveryService] findDeliveriedExpressionsByUid 에러:', error);
      throw new Error('사용자에게 전달된 표현 조회 중 오류가 발생했습니다.');
    }
  }
  
}