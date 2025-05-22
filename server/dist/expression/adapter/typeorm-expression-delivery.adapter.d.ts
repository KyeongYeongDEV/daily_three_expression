import { DataSource } from 'typeorm';
import { ExpressionDeliveryPort } from '../port/expression-delivery.port';
import { ExpressionResponseDto } from '../dto/response.dto';
export declare class TypeOrmExpressionDeliveryAdapter implements ExpressionDeliveryPort {
    private readonly datasource;
    constructor(datasource: DataSource);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionResponseDto[]>;
}
