import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Expression } from '../../ai/entitys/expression.entity';

@Entity()
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

  @ManyToMany(() => Expression, (expression) => expression.users)
  @JoinTable({
    name: 'user_expression_progress',
    joinColumn: { name: 'u_id', referencedColumnName: 'u_id' },
    inverseJoinColumn: { name: 'e_id', referencedColumnName: 'e_id' },
  })
  expressions: Expression[];
}