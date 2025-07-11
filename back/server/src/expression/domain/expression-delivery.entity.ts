import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/domain/user.entity';
import { ExpressionEntity } from './expression.entity';

export type DeliveryStatus = 'success' | 'failed' | 'pending';

@Entity('expression_delivery')
export class ExpressionDeliveryEntity {
  @PrimaryGeneratedColumn()
  ue_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  transmitted_at: Date;

  @Column({ type: 'enum', enum: ['success', 'failed', 'pending'], default: 'pending' })
  delivery_status: DeliveryStatus;

  @Column()
  u_id: number; 
  
  @Column()
  e_id: number; 

  @ManyToOne(() => UserEntity, (user) => user.deliveries)
  @JoinColumn({ name: 'u_id' })
  user: UserEntity;

  @ManyToOne(() => ExpressionEntity, (expression) => expression.deliveries)
  @JoinColumn({ name: 'e_id' })
  expression: ExpressionEntity;
}