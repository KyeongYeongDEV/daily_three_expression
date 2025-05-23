import { MailerService } from './mailer.service';
export declare class MailerController {
    private readonly mailerSerivce;
    constructor(mailerSerivce: MailerService);
    sendEmail(): Promise<any>;
}
