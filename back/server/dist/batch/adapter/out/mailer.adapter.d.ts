import { ConfigService } from '@nestjs/config';
import { SendMailPort } from 'src/batch/port/out/send-mail.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { UserPort } from 'src/user/port/user.port';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';
export declare class MailerAdapter implements SendMailPort {
    private readonly configService;
    private readonly expressionPort;
    private readonly expressionDeliveryPort;
    private readonly userPort;
    private transporter;
    constructor(configService: ConfigService, expressionPort: ExpressionPort, expressionDeliveryPort: ExpressionDeliveryPort, userPort: UserPort);
    private getYesterdayAndStart;
    sendExpression(): Promise<void>;
    sendEmailVerificationCode(to: string, code: string): Promise<boolean>;
}
