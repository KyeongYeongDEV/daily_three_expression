import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './adapter/in/expression.controller';
import { ExpressionService } from './service/expression.service';
import { ExpressionEntity } from './domain/expression.entity';

import { EXPRESSION_PORT } from './port/expression.port';
import { EXPRESSION_DELIVERY_PORT } from './port/expression-delivery.port';

import { TypeOrmExpressionAdapter } from './adapter/out/expression.adapter';
import { ExpressionDeliveryAdapter } from './adapter/out/expression-delivery.adapter';
import { AiModule } from 'src/ai/ai.module';
import { ExpressionGenerationService } from './service/expression-generation.service';
import { ExpressionBlackListEntity } from './domain/expression-black-list.entity';
import { ExpressionDeliveryEntity } from './domain/expression-delivery.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpressionEntity,
      ExpressionBlackListEntity,
      ExpressionDeliveryEntity
    ]),
    forwardRef(() => AiModule),
  ],
  controllers: [ExpressionController],
  providers: [
    ExpressionService,
    ExpressionGenerationService,
    TypeOrmExpressionAdapter,
    ExpressionDeliveryAdapter,
    {
      provide: EXPRESSION_PORT,
      useExisting: TypeOrmExpressionAdapter,
    },
    {
      provide: EXPRESSION_DELIVERY_PORT,
      useExisting: ExpressionDeliveryAdapter,
    },
  ],
  exports: [
    ExpressionService,
    ExpressionGenerationService,
    TypeOrmExpressionAdapter,
    EXPRESSION_PORT,
  ],
})
export class ExpressionModule {}
