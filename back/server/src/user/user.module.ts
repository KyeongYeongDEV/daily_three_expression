import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adpater/in/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './domain/user.entity';
import { UserAdapter } from './adpater/out/user.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserAdapter,
    {
      provide: 'UserPort',
      useExisting: UserAdapter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
