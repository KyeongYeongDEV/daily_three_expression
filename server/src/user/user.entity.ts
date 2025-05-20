import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ExpressionDeliveryEntity } from '../expression/entities/expression-delivery.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  u_id: number;

  @Column()
  email: string;

  @Column()
  level: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: false })
  is_email_subscribed: boolean;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ExpressionDeliveryEntity, (delivery) => delivery.user)
  deliveries: ExpressionDeliveryEntity[];
}
