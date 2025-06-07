export interface SendMailPort {
    sendExpression(): Promise<void>;
    sendEmailVerificationCode(to: string, code: string): Promise<boolean>;
}
