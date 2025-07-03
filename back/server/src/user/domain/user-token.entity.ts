import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_token')
export class UserTokenEntity {
  @PrimaryGeneratedColumn()
  ut_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  token: string;

  @Column({
    type: 'enum',
    enum: ['active', 'expired', 'used'],
    default: 'active',
  })
  status: 'active' | 'expired' | 'used';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  expire_at: Date;
  
  @BeforeInsert()
  setExpirationDate() {
    const now = new Date();
    this.expire_at = new Date(now.getTime() +  1000 * 60 * 60  * 24);
  }
}