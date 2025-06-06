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
    const deliveredExpressions = await this.expressionDeliveryRepository
    .createQueryBuilder('delivery')
    .innerJoinAndSelect('delivery.expression', 'expression') 
    .innerJoin('delivery.user', 'user')
    .where('user.u_id = :u_id', { u_id })
    .getMany(); 
    
    return deliveredExpressions.map(delivery => delivery.expression as ExpressionResponseDto);
  }
  
  async findStartExpressionId(today : Date, yesterday : Date): Promise<number> {
    const result = await this.expressionDeliveryRepository
    .createQueryBuilder('delivery') 
    .select('delivery.e_id', 'e_id') 
    .where('delivery.transmitted_at >= :yesterdayStart', { yesterdayStart: yesterday }) 
    .andWhere('delivery.transmitted_at < :todayStart', { todayStart: today }) 
    .andWhere('delivery.delivery_status = :status', { status: 'success' }) 
    .orderBy('delivery.ue_id', 'ASC') 
    .getRawOne(); 
    
    return result ? result.e_id : 0;
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
