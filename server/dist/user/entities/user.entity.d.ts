import { ExpressionDelivery } from '../../expression/entities/expression_delivery.entity';
export declare class User {
    u_id: number;
    email: string;
    level: string;
    is_email_verified: boolean;
    is_email_subscribed: boolean;
    created_at: Date;
    updated_at: Date;
    deliveries: ExpressionDelivery[];
}
