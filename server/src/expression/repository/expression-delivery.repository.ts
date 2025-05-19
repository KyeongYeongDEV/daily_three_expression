import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ExpressionEntity } from "../entities/expression.entity";


@Injectable()
export class ExpressionDeliveryRepository {
  constructor( private readonly datasource : DataSource ){}

  async findDeliveriedExpressionsByUid(u_id: number): Promise<ExpressionEntity[]> {
    return await this.datasource
              .getRepository(ExpressionEntity)
              .createQueryBuilder('expression')
              .innerJoin('expression.deliveries', 'delivery')
              .where('delivery.u_id = :u_id', { u_id })
              .getMany();
  }
}