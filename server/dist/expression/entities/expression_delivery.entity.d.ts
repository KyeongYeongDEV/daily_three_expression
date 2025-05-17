import { User } from '../../user/entities/user.entity';
import { Expression } from './expression.entity';
export type DeliveryStatus = 'success' | 'failed' | 'pending';
export declare class ExpressionDelivery {
    ue_id: number;
    transmitted_at: Date;
    delivery_status: DeliveryStatus;
    user: User;
    expression: Expression;
}
