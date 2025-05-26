import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchMailService } from '../service/batch.service';
import { ExpressionGenerationService } from 'src/expression/service/expression-generation.service';

@Injectable()
export class BatchMailScheduler {
  constructor(
    private readonly batchService: BatchMailService,
    private readonly expressionGenerator: ExpressionGenerationService,
  ) {}

  @Cron('*/1 * * * *') // 매 1분마다
  async handleCron() {
    await this.batchService.sendTestEmails();
  }

  @Cron('0/10 * * * *') // 매일 새벽 3시
  async handle() {
    await this.expressionGenerator.runExpressionGenerationBatch();
  }
}
