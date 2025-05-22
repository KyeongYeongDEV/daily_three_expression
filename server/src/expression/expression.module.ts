import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './adapter/in/expression.controller';
import { ExpressionService } from './service/expression.service';
import { ExpressionEntity } from './domain/expression.entity';

import { EXPRESSION_PORT } from './port/expression.port';
import { EXPRESSION_DELIVERY_PORT } from './port/expression-delivery.port';

import { TypeOrmExpressionAdapter } from './adapter/out/typeorm-expression.adapter';
import { TypeOrmExpressionDeliveryAdapter } from './adapter/out/typeorm-expression-delivery.adapter';

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
