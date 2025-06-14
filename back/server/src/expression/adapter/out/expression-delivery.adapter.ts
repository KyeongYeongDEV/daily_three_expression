import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExpressionDeliveryPort } from '../../port/expression-delivery.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { DeliveryStatus, ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpressionDeliveryAdapter implements ExpressionDeliveryPort {
  constructor(
    @InjectRepository(ExpressionDeliveryEntity)
        private readonly expressionDeliveryRepository: Repository<ExpressionDeliveryEntity>,
  ) {}
  
  async findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]> {
    const result = await this.expressionDeliveryRepository
    .createQueryBuilder('delivery')
    .innerJoinAndSelect('delivery.expression', 'expression') 
    .innerJoin('delivery.user', 'user')
    .where('user.u_id = :u_id', { u_id })
    .getMany(); 
    
    return result.map(delivery => delivery.expression as ExpressionResponseDto);
  }
  
  async findStartExpressionId(): Promise<number> {
    const result = await this.expressionDeliveryRepository
      .createQueryBuilder('delivery')
      .select('MAX(delivery.e_id)', 'max_e_id')
      .where('delivery.delivery_status = :status', { status: 'success' })
      .getRawOne();
  
    return result?.max_e_id ?? 9;
  }
  

  async saveExpressionDeliveried(u_id: number, e_id: number, deliveryStatus: DeliveryStatus): Promise<void> {
    await this.expressionDeliveryRepository.save({
      transmitted_at: new Date(),
      delivery_status: deliveryStatus,
      u_id: u_id,
      e_id: e_id,
    });
  }
}
