import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import { ConfigService } from '@nestjs/config';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { UserPort } from 'src/user/port/user.port';
export declare class MailerAdapter implements SendMailPort {
    private readonly configService;
    private readonly expressionPort;
    private readonly userPort;
    private transporter;
    constructor(configService: ConfigService, expressionPort: ExpressionPort, userPort: UserPort);
    sendExpression(): Promise<void>;
    sendEmailVerificationCode(to: string, code: string): Promise<boolean>;
}
