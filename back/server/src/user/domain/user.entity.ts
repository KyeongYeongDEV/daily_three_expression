import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ExpressionDeliveryEntity } from '../../expression/domain/expression-delivery.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  u_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  is_email_verified: boolean;

  @Column({ default: true })
  is_email_subscribed: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ExpressionDeliveryEntity, (delivery) => delivery.user)
  deliveries: ExpressionDeliveryEntity[];
}
