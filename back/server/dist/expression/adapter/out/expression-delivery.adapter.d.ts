import { Repository } from 'typeorm';
import { ExpressionDeliveryPort } from '../../port/expression-delivery.port';
import { DeliveryStatus, ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';
import { ExpressionResponseDto } from 'src/expression/dto/response.dto';
export declare class ExpressionDeliveryAdapter implements ExpressionDeliveryPort {
    private readonly expressionDeliveryRepository;
    constructor(expressionDeliveryRepository: Repository<ExpressionDeliveryEntity>);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]>;
    findStartExpressionId(): Promise<number>;
    saveExpressionDeliveried(u_id: number, e_id: number, deliveryStatus: DeliveryStatus): Promise<void>;
}
