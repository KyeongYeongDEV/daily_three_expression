export interface SendMailPort {
    send(to: string, subject: string, html: string): Promise<void>;
}
