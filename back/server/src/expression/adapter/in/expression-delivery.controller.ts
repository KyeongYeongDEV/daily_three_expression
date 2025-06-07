import { Controller, Get, Param } from "@nestjs/common";
import { ExpressionDeliveryService } from "src/expression/service/expression-delivery.service";

@Controller('expression-deliveried')
export class ExpressionDeliveryController {
  constructor(
    private readonly expressionDeliveryService: ExpressionDeliveryService,
  ) {}

  @Get('/:u_id')
  async getDeliveriedExpressionsByUid(
    @Param('u_id') uId: number,
  ) {
    return this.expressionDeliveryService.findDeliveriedExpressionsByUid(uId);
  }

  @Get('/start-eid')
  async getStartExpressionId(): Promise<number> {
    return this.expressionDeliveryService.findStartExpressionId();
  }
}