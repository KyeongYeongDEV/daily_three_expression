import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPort } from './user.port';

@Injectable()
export class TypeOrmUserAdapter implements UserPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.exist({ where: { email } });
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}
