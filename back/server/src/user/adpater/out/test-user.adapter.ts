import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestUserPort } from '../../port/test-user.port';
import { TestUserEntity } from '../../domain/test-user.entity';
import { UsersWithUuidType } from '../../../common/types/user.type';

@Injectable()
export class TestUserQueryAdapter implements TestUserPort {
  constructor(
    @InjectRepository(TestUserEntity)
    private readonly testUserRepository: Repository<TestUserEntity>,
  ) {}

  async findAll(): Promise<UsersWithUuidType[]> {
    const users = await this.testUserRepository.find();
    return users.map(u => ({
      u_id: u.u_id,
      email: u.email,
      uuid: u.uuid,
    }));
  }
}
