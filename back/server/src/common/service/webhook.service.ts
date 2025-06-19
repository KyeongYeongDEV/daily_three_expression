// src/common/service/webhook.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WebhookService {
  constructor(
    private readonly configService: ConfigService, 
  ) {}

  async sendMessage(content: string): Promise<void> {
    const webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
    if (!webhookUrl) return;
    await axios.post(webhookUrl, { content });
  }
}
