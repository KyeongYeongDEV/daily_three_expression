import { Inject, Injectable } from '@nestjs/common';
import { SendMailPort } from '../port/out/send-mail.port';

@Injectable()
export class BatchMailService {
  constructor(
    @Inject('SendMailPort') 
    private readonly mailSender: SendMailPort,
  ) {}

  async sendTestEmails(): Promise<void> {
    try {
      await this.mailSender.sendExpression();
    } catch (error) { 
      console.error('Error sending test emails:', error);
      throw new Error('Failed to send test emails');
    }
  }
}
