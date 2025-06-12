import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ExpressionDeliveryEntity, (delivery) => delivery.user)
  deliveries: ExpressionDeliveryEntity[];
}
