import { ExpressionDeliveryEntity } from '../../expression/domain/expression-delivery.entity';
export declare class UserEntity {
    u_id: number;
    email: string;
    is_email_verified: boolean;
    is_email_subscribed: boolean;
    created_at: Date;
    updated_at: Date;
    deliveries: ExpressionDeliveryEntity[];
}
