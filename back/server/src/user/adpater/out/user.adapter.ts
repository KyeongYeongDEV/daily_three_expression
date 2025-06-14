import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../domain/user.entity';
import { UserPort } from '../../port/user.port';
import { UserExistDTO } from '../../dto/response.dto';
import { UserEmailType } from 'src/common/types/user.type';

@Injectable()
export class UserAdapter implements UserPort {
  constructor(
    @InjectRepository( UserEntity )
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource, 
  ) {}

  async findAllUsersEmail(): Promise<UserEmailType[]> {
    const results = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.u_id', 'user.email'])
      .where('user.is_email_subscribed = true')
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

  // async saveUser( user: UserEntity ): Promise<UserEntity> {
  //   return this.userRepository.save(user);
  // }

  async saveUser(user: UserEntity): Promise<UserEntity> {
    const now = new Date();
  
    const result = await this.dataSource.query(
      `INSERT INTO "user" (email, is_email_verified, is_email_subscribed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING u_id`,
      [
        user.email,
        user.is_email_verified,
        user.is_email_subscribed,
        now,
        now,
      ]
    );
  
    // INSERT 결과로 생성된 ID를 반환하려면 다음과 같이 처리
    const insertedId = result.insertId || result[0]?.insertId;
  
    return {
      ...user,
      u_id: insertedId,
      created_at: now,
      updated_at: now,
    };
  }
  
}
