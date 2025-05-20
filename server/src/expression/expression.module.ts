import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './expression.controller';
import { ExpressionService } from './expression.service';
import { ExpressionEntity } from './entities/expression.entity';

import { EXPRESSION_PORT } from './port/expression.port';
import { EXPRESSION_DELIVERY_PORT } from './port/expression-delivery.port';

import { TypeOrmExpressionAdapter } from './adapter/typeorm-expression.adapter';
import { TypeOrmExpressionDeliveryAdapter } from './adapter/typeorm-expression-delivery.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([ExpressionEntity])],
  controllers: [ExpressionController],
  providers: [
    ExpressionService,
    TypeOrmExpressionAdapter,
    TypeOrmExpressionDeliveryAdapter,
    {
      provide: EXPRESSION_PORT,
      useExisting: TypeOrmExpressionAdapter,
    },
    {
      provide: EXPRESSION_DELIVERY_PORT,
      useExisting: TypeOrmExpressionDeliveryAdapter,
    },
  ],
  exports: [ExpressionService],
})
export class ExpressionModule {}
