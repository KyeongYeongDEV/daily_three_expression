import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adpater/in/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './domain/user.entity';
import { UserAdapter } from './adpater/out/user.adapter';
import { RedisAdapter } from 'src/auth/adapter/out/redis.adpter';
import { RedisConfigModule } from 'src/common/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisConfigModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserAdapter,
    RedisAdapter,
    {
      provide: 'UserPort',
      useExisting: UserAdapter,
    },
    {
      provide: 'RedisPort',   
      useExisting: RedisAdapter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
