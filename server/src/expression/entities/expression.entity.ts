import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ExpressionDelivery } from './expression_delivery.entity';

@Entity('expression')
export class Expression {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column()
  expression_numer: number;

  @Column()
  category: string;

  @Column()
  expression: string;

  @Column()
  example1: string;

  @Column()
  example2: string;

  @Column()
  translation_expression: string;

  @Column()
  translation_example1: string;

  @Column()
  translation_example2: string;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ExpressionDelivery, (delivery) => delivery.expression)
  deliveries: ExpressionDelivery[];
}
