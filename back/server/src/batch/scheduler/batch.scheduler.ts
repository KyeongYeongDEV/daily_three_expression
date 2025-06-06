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

  @Cron('0 6 * * 1-5') // 평일(월~금) 새벽 6시마다
  async handleCron() {
    await this.batchService.sendEmails();
  }

  // @Cron('0/2 * * * *') //  @Cron('* 3 * * * *')매일 새벽 3시
  // async handle() {
  //   console.log('✅ Batch Expression Generation started');
  //   await this.expressionGenerator.runExpressionGenerationBatch();
  // }
}
