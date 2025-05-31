import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adpater/in/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './domain/user.entity';
import { TypeOrmUserAdapter } from './adpater/out/typeorm-user.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    TypeOrmUserAdapter,
    {
      provide: 'UserPort',
      useExisting: TypeOrmUserAdapter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
