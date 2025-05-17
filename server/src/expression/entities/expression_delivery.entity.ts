import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Expression } from './expression.entity';

export type DeliveryStatus = 'success' | 'failed' | 'pending';

@Entity('expression_delivery')
export class ExpressionDelivery {
  @PrimaryGeneratedColumn()
  ue_id: number;

  @Column({ type: 'date' })
  transmitted_at: Date;

  @Column({ type: 'enum', enum: ['success', 'failed', 'pending'], default: 'pending' })
  delivery_status: DeliveryStatus;

  @ManyToOne(() => User, (user) => user.deliveries)
  @JoinColumn({ name: 'u_id' })
  user: User;

  @ManyToOne(() => Expression, (expression) => expression.deliveries)
  @JoinColumn({ name: 'e_id' })
  expression: Expression;
}
