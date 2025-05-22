import { ExpressionDeliveryEntity } from '../../expression/entities/expression-delivery.entity';
export declare class UserEntity {
    u_id: number;
    email: string;
    level: string;
    is_email_verified: boolean;
    is_email_subscribed: boolean;
    created_at: Date;
    updated_at: Date;
    deliveries: ExpressionDeliveryEntity[];
}
