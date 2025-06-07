import { SendMailPort } from '../port/out/send-mail.port';
export declare class BatchMailService {
    private readonly mailSender;
    constructor(mailSender: SendMailPort);
    sendEmails(): Promise<void>;
}
