import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entitys/user.entity';
import { Expression } from '../../ai/entitys/expression.entity';

export type DeliveryStatus = 'success' | 'failed' | 'pending';

@Entity('user_expression_progress')
export class UserExpressionProgress {
  @PrimaryGeneratedColumn()
  ue_id: number;

  @Column({ type: 'date' })
  transmitted_at: Date;

  @Column({ type: 'enum', enum: ['success', 'failed', 'pending'], default: 'pending' })
  delivery_status: DeliveryStatus;

  @ManyToOne(() => User, (user) => user.expressions)
  @JoinColumn({ name: 'u_id' })
  user: User;

  @ManyToOne(() => Expression, (expression) => expression.users)
  @JoinColumn({ name: 'e_id' })
  expression: Expression;
}