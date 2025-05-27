import { ExpressionPort } from '../../expression/port/expression.port';
import { UserPort } from '../../user/port/user.port';
import { SendMailPort } from '../port/out/send-mail.port';
export declare class BatchMailService {
    private readonly expressionPort;
    private readonly userPort;
    private readonly mailSender;
    constructor(expressionPort: ExpressionPort, userPort: UserPort, mailSender: SendMailPort);
    sendTestEmails(): Promise<void>;
}
