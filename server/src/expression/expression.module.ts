import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './expression.controller';
import { ExpressionService } from './expression.service';
import { ExpressionRepository } from './repository/expression.repository';
import { ExpressionEntity } from './entities/expression.entity';
import { ExpressionDeliveryRepository } from './repository/expression-delivery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExpressionEntity])],
  controllers: [ExpressionController],
  providers: [ExpressionService, ExpressionRepository, ExpressionDeliveryRepository],
  exports: [ExpressionRepository, ExpressionDeliveryRepository],
})
export class ExpressionModule {}
