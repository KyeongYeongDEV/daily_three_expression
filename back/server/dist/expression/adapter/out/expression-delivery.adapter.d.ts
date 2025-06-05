import { Repository } from 'typeorm';
import { ExpressionDeliveryPort } from '../../port/expression-delivery.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';
export declare class ExpressionDeliveryAdapter implements ExpressionDeliveryPort {
    private readonly expressionDeliveryRepository;
    constructor(expressionDeliveryRepository: Repository<ExpressionDeliveryEntity>);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]>;
    findStartExpressionId(today: Date, yesterday: Date): Promise<number>;
}
