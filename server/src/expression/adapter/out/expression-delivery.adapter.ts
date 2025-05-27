import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EXPRESSION_DELIVERY_PORT, ExpressionDeliveryPort } from '../../port/expression-delivery.port';
import { ExpressionResponseDto } from '../../dto/response.dto';

@Injectable()
export class TypeOrmExpressionDeliveryAdapter implements ExpressionDeliveryPort {
  constructor(private readonly datasource: DataSource) {}

  async findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]> {
    return await this.datasource
      .getRepository(ExpressionResponseDto)
      .createQueryBuilder('expression')
      .innerJoin('expression.deliveries', 'delivery')
      .where('delivery.user.u_id = :u_id', { u_id })
      .getMany();
  }
}
