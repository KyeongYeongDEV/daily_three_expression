import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './adapter/in/expression.controller';
import { ExpressionService } from './service/expression.service';
import { ExpressionEntity } from './domain/expression.entity';

import { EXPRESSION_PORT } from './port/expression.port';
import { EXPRESSION_DELIVERY_PORT } from './port/expression-delivery.port';

import { TypeOrmExpressionAdapter } from './adapter/out/expression.adapter';
import { TypeOrmExpressionDeliveryAdapter } from './adapter/out/expression-delivery.adapter';
import { AiModule } from 'src/ai/ai.module';
import { ExpressionGenerationService } from './service/expression-generation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpressionEntity]),
    forwardRef(() => AiModule),
  ],
  controllers: [ExpressionController],
  providers: [
    ExpressionService,
    ExpressionGenerationService,
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
  exports: [
    ExpressionService,
    ExpressionGenerationService,
    EXPRESSION_PORT,
  ],
})
export class ExpressionModule {}
