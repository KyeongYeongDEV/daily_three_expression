import { DataSource } from "typeorm";
import { ExpressionDeliveryEntity } from "../entities/expression-delivery.entity";
export declare class ExpressionDeliveryRepository {
    private readonly datasource;
    constructor(datasource: DataSource);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionDeliveryEntity[]>;
}
