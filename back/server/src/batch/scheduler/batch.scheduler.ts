import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchMailService } from '../service/batch.service';
import { AiService } from 'src/ai/service/ai.service';

@Injectable()
export class BatchMailScheduler {
  constructor(
    private readonly batchService: BatchMailService,
    private readonly aiService : AiService,
  ) {}

  // //@Cron('*/2 * * * *') // 매 2분마다 실행 (테스트용)
  // @Cron('0 6 * * 1-5') // 평일(월~금) 새벽 6시마다
  // async sendExpressionByEmail() {
  //   console.log('✅ Batch Send Expression started');
  //   await this.batchService.sendEmails();
  // }

  // @Cron('0 15 * * *') // 매일 오후 3시에 실행
  // async getExpressionFromAi() {
  //   console.log('✅ Batch Get Expression From AI started');
  //   await this.aiService.generateAndSaveUniqueExpressions();
  // }
}