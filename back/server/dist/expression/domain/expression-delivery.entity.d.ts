import { UserEntity } from '../../user/domain/user.entity';
import { ExpressionEntity } from './expression.entity';
export type DeliveryStatus = 'success' | 'failed' | 'pending';
export declare class ExpressionDeliveryEntity {
    ue_id: number;
    transmitted_at: Date;
    delivery_status: DeliveryStatus;
    user: UserEntity;
    expression: ExpressionEntity;
}
