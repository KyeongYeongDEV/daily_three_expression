// expression.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpressionController } from './expression.controller';
import { ExpressionService } from './expression.service';
import { ExpressionRepository } from './expression.repository';
import { Expression } from './entities/expression.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expression])],
  controllers: [ExpressionController],
  providers: [ExpressionService, ExpressionRepository],
  exports: [ExpressionRepository],
})
export class ExpressionModule {}
