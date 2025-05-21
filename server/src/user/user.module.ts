import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmUserAdapter } from './typeorm-user.adapter';

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
