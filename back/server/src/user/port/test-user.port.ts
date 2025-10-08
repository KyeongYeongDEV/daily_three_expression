import { UserEmailType, UsersWithUuidType } from '../../common/types/user.type';

export const TestUserPort = 'TestUserPort';

export interface TestUserPort {
  findAll(): Promise<UsersWithUuidType[]>;
  findUsersForBatch(lastId: number, limit: number): Promise<UserEmailType[]>;
  sendEmailsToAllUsers(): Promise<{ count: number }>;
}
