import { Repository } from 'typeorm';
import { ExpressionDeliveryPort } from '../../port/expression-delivery.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { DeliveryStatus, ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';
export declare class ExpressionDeliveryAdapter implements ExpressionDeliveryPort {
    private readonly expressionDeliveryRepository;
    constructor(expressionDeliveryRepository: Repository<ExpressionDeliveryEntity>);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]>;
    findStartExpressionId(today: Date, yesterday: Date): Promise<number>;
    saveExpressionDeliveried(u_id: number, e_id: number, deliveryStatus: DeliveryStatus): Promise<void>;
}
