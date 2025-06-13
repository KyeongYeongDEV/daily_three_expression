import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './adapter/in/expression.controller';
import { ExpressionService } from './service/expression.service';
import { ExpressionEntity } from './domain/expression.entity';

import { EXPRESSION_PORT } from './port/expression.port';
import { EXPRESSION_DELIVERY_PORT } from './port/expression-delivery.port';

import { ExpressionAdapter } from './adapter/out/expression.adapter';
import { ExpressionDeliveryAdapter } from './adapter/out/expression-delivery.adapter';
import { AiModule } from 'src/ai/ai.module';
import { ExpressionGenerationService } from './service/expression-generation.service';
import { ExpressionBlackListEntity } from './domain/expression-black-list.entity';
import { ExpressionDeliveryEntity } from './domain/expression-delivery.entity';
import { ExpressionDeliveryController } from './adapter/in/expression-delivery.controller';
import { ExpressionDeliveryService } from './service/expression-delivery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpressionEntity,
      ExpressionBlackListEntity,
      ExpressionDeliveryEntity
    ]),
    forwardRef(() => AiModule),
  ],
  controllers: [ExpressionController, ExpressionDeliveryController],
  providers: [
    ExpressionService,
    ExpressionGenerationService,
    ExpressionAdapter,
    ExpressionDeliveryService,
    ExpressionDeliveryAdapter,
    {
      provide: EXPRESSION_PORT,
      useExisting: ExpressionAdapter,
    },
    {
      provide: EXPRESSION_DELIVERY_PORT,
      useExisting: ExpressionDeliveryAdapter,
    },
  ],
  exports: [
    ExpressionService,
    ExpressionGenerationService,
    ExpressionAdapter,
    ExpressionDeliveryAdapter,
    EXPRESSION_PORT,
    EXPRESSION_DELIVERY_PORT,
  ],
})
export class ExpressionModule {}
