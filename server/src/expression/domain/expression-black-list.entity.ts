import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('expression_black_list')
export class ExpressionBlackListEntity {
  @PrimaryGeneratedColumn()
  b_id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  expression: string;

  @Column({ type: 'int', default: 1 })
  count: number;
}