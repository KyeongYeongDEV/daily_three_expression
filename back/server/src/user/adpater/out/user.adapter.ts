import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../domain/user.entity';
import { UserPort } from '../../port/user.port';
import { UserExistDTO } from '../../dto/response.dto';
import { UserEmailType } from '../../../common/types/user.type';

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
    .andWhere('user.is_email_subscribed = true')
    .getOne();
  }

  async findUserByUid( u_id : number ): Promise<UserEntity | null> {
    return this.userRepository.createQueryBuilder('user')
    .select([
      'user.u_id',
      'user.email',
    ])
    .where('user.u_id = :u_id', { u_id })
    .andWhere('user.is_email_subscribed = true')
    .getOne();
  }

  async saveUser(user: UserEntity): Promise<UserEntity & { is_created: boolean }> {
    const rows = await this.dataSource.query(
      `
      INSERT INTO "user" (email, is_email_verified, is_email_subscribed)
      VALUES ($1, $2, $3)
      ON CONFLICT (email)
      DO UPDATE SET
        is_email_verified   = EXCLUDED.is_email_verified,
        is_email_subscribed = EXCLUDED.is_email_subscribed,
        updated_at          = NOW()
      RETURNING
        u_id,
        email,
        is_email_verified,
        is_email_subscribed,
        created_at,
        updated_at,
        (xmax = 0) AS is_created  
      `,
      [
        user.email,
        user.is_email_verified,
        user.is_email_subscribed,
      ]
    );
  
    return rows[0];
  }
  

  async updateSubscribeStatus(email: string, isSubscribed: boolean): Promise<void> {
    await this.userRepository.update(
      { email },
      { is_email_subscribed: isSubscribed }
    );
  }

  async updateSubscribeByEmail(email: string): Promise<UserEntity> {
    await this.userRepository.update({ email }, { is_email_subscribed: true });
    const user = await this.findUserInfoByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user; // 업데이트된 값 반환
  }

  async findUsersForBatch(lastId: number, limit: number): Promise<UserEmailType[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .select(['user.u_id', 'user.email'])
      .where('user.is_email_subscribed = true')
      .andWhere('user.u_id > :lastId', { lastId }) // 마지막 ID보다 큰 ID만 조회
      .orderBy('user.u_id', 'ASC') // ID 순서로 정렬해야 페이지네이션이 보장됨
      .limit(limit);

    const results = await query.getRawMany();

    return results.map(result => ({
      u_id: result.user_u_id,
      email: result.user_email,
    }));
  }
}
