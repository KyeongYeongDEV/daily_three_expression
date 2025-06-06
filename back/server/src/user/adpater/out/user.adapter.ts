import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/user.entity';
import { UserPort } from '../../port/user.port';
import { UserExistDTO } from '../../dto/response.dto';
import { UserEmailType } from 'src/common/types/user.type';

@Injectable()
export class UserAdapter implements UserPort {
  constructor(
    @InjectRepository( UserEntity )
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllUsersEmail(): Promise<UserEmailType[]> {
    const results = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.u_id', 'user.email'])
      .getRawMany();
  
    return results.map(result => ({
      u_id: result.user_u_id,
      email: result.user_email
    }));
  }

  async findUserInfoByEmail( email: string ): Promise<UserEntity | null> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.email = :email', { email })
    .getOne();
  }

  async findUserByEmail( email: string ): Promise<UserExistDTO | null> {
    return this.userRepository.createQueryBuilder('user')
    .where('user.email = :email', { email })
    .getOne();
  }

  async findUserByUid( u_id : number ): Promise<UserEntity | null> {
    return this.userRepository.createQueryBuilder('user')
    .select([
      'user.u_id',
      'user.email',
    ])
    .where('user.u_id = :u_id', { u_id })
    .getOne();
  }

  async saveUser( user: UserEntity ): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}
