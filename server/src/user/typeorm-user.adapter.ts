import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserPort } from './user.port';
import { UserExistDTO } from './dto/response.dto';

@Injectable()
export class TypeOrmUserAdapter implements UserPort {
  constructor(
    @InjectRepository( UserEntity )
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  findUserInfoByEmail( email: string ): Promise<UserEntity | null> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.email = :email', { email })
    .getOne();
  }

  findUserByEmail( email: string ): Promise<UserExistDTO | null> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.email = :email', { email })
    .getOne();
  }

  findUserByUid( u_id : number ): Promise<UserEntity | null> {
    return this.userRepository.createQueryBuilder('user')
    .select([
      'user.u_id',
      'user.email',
    ])
    .where('user.u_id = :u_id', { u_id })
    .getOne();
  }

  saveUser( user: UserEntity ): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}
