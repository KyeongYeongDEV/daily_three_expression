import { Module, forwardRef } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './adpater/in/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './domain/user.entity';
import { UserAdapter } from './adpater/out/user.adapter';
import { ConfigModule } from '../common/config/config.module';
import { TestUserQueryAdapter } from './adpater/out/test-user.adapter';
import { TestUserEntity } from './domain/test-user.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([TestUserEntity]),
    ConfigModule, 
    forwardRef(() => AuthModule), 
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserAdapter,
    TestUserQueryAdapter,
    {
      provide: 'UserPort',
      useExisting: UserAdapter,
    },
    {
      provide: 'TestUserPort',
      useClass: TestUserQueryAdapter,
    },
  ],
  exports: [UserService, 'TestUserPort'],
})
export class UserModule {}