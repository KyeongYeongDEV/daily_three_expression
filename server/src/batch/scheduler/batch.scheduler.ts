import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchMailService } from '../service/batch.service';

@Injectable()
export class BatchMailScheduler {
  constructor(private readonly batchService: BatchMailService) {}

  @Cron('*/1 * * * *') // 매 1분마다
  async handleCron() {
    await this.batchService.sendTestEmails();
  }
}
