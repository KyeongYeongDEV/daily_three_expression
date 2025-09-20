import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adpater/in/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './domain/user.entity';
import { UserAdapter } from './adpater/out/user.adapter';
import { RedisAdapter } from '../auth/adapter/out/redis.adpter';
import { RedisConfigModule } from '../common/config/config.module';
import { TestUserPort } from './port/test-user.port';
import { TestUserQueryAdapter } from './adpater/out/test-user.adapter';
import { TestUserEntity } from './domain/test-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([TestUserEntity]), 
    RedisConfigModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserAdapter,
    TestUserQueryAdapter,
    RedisAdapter,
    {
      provide: 'UserPort',
      useExisting: UserAdapter,
    },
    {
      provide: 'RedisPort',   
      useExisting: RedisAdapter,
    },
    {
      provide: 'TestUserPort',
      useClass: TestUserQueryAdapter,
    },
  ],
  exports: [UserService, 'TestUserPort'],
})
export class UserModule {}
