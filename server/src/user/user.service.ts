import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from './user.port';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {}

  async register(user: UserEntity): Promise<UserEntity> {
    const exists = await this.userPort.existsByEmail(user.email);
    if (exists) throw new Error('이미 가입된 이메일입니다.');

    return this.userPort.save(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userPort.findByEmail(email);
  }
}
