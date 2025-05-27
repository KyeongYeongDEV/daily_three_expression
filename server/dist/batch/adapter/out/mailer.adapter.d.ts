import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import { ConfigService } from '@nestjs/config';
export declare class MailerAdapter implements SendMailPort {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    send(to: string, subject: string, html: string): Promise<void>;
}
