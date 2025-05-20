import { UserEntity } from './user.entity';

export interface UserPort {
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<UserEntity>;
  existsByEmail(email: string): Promise<boolean>;
}
