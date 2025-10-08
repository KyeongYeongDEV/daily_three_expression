import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUserPort } from '../../port/test-user.port';
import { TestUserEntity } from '../../domain/test-user.entity';
import { UserEmailType, UsersWithUuidType } from '../../../common/types/user.type';

@Injectable()
export class TestUserQueryAdapter implements TestUserPort {
  constructor(
    @InjectRepository(TestUserEntity)
    private readonly testUserRepository: Repository<TestUserEntity>,
  ) {}
  sendEmailsToAllUsers(): Promise<{ count: number; }> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<UsersWithUuidType[]> {
    const users = await this.testUserRepository.find();
    return users.map(u => ({
      u_id: u.u_id,
      email: u.email,
      uuid: u.uuid,
    }));
  }

  async findUsersForBatch(lastId: number, limit: number): Promise<UsersWithUuidType[]> {
    const users = await this.testUserRepository
      .createQueryBuilder('test_user')
      .where('test_user.u_id > :lastId', { lastId })
      .orderBy('test_user.u_id', 'ASC')
      .limit(limit)
      .getMany(); 

    return users.map(u => ({
      u_id: u.u_id,
      email: u.email,
      uuid: u.uuid,
    }));
  }
}
