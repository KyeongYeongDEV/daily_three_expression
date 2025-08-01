import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('test_users')
export class TestUserEntity {
  @PrimaryGeneratedColumn()
  u_id: number;

  @Column()
  email: string;

  @Column()
  uuid: string;
}
