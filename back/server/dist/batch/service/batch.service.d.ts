import { SendMailPort } from '../../mailer/port/out/send-mail.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';
import { UserPort } from 'src/user/port/user.port';
import { AuthServicePort } from 'src/auth/port/in/auth.service.port';
export declare class BatchMailService {
    private readonly mailSender;
    private readonly expressionPort;
    private readonly expressionDeliveryPort;
    private readonly userPort;
    private readonly authService;
    constructor(mailSender: SendMailPort, expressionPort: ExpressionPort, expressionDeliveryPort: ExpressionDeliveryPort, userPort: UserPort, authService: AuthServicePort);
    sendEmails(): Promise<void>;
}
