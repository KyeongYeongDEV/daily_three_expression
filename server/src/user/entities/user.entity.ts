import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ExpressionDelivery } from '../../expression/entities/expression-delivery.entity';

@Entity('user')
export class User {
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

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date' })
  updated_at: Date;

  @OneToMany(() => ExpressionDelivery, (delivery) => delivery.user)
  deliveries: ExpressionDelivery[];
}
