import { DataSource } from "typeorm";
import { ExpressionEntity } from "../entities/expression.entity";
export declare class ExpressionDeliveryRepository {
    private readonly datasource;
    constructor(datasource: DataSource);
    findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionEntity[]>;
}
