import { Module } from '@nestjs/common';
import { WebhookService } from './service/webhook.service';

@Module({
  providers: [WebhookService],
  exports: [WebhookService],
})
export class CommonModule {}