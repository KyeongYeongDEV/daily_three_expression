import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../user/entitys/user.entity';

@Entity()
export class Expression {
  @PrimaryGeneratedColumn()
  e_id: number;

  @Column()
  expression_numer : number;

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

  @ManyToMany(() => User, (user) => user.expressions)
  users: User[];
}