import { UsersWithUuidType } from 'src/common/types/user.type';

export const TestUserPort = 'TestUserPort';

export interface TestUserPort {
  findAll(): Promise<UsersWithUuidType[]>;
}
