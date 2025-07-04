import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Generated,
} from 'typeorm';
import { ExpressionDeliveryEntity } from './expression-delivery.entity';

@Entity('expression')
export class ExpressionEntity {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column({ type: 'int' })
  @Generated('increment')
  expression_number: number;

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ExpressionDeliveryEntity, (delivery) => delivery.expression)
  deliveries: ExpressionDeliveryEntity[];
}
