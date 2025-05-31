export interface SendMailPort {
  sendExpression(): Promise<void>;
  sendCode(to: string): Promise<void>;
}