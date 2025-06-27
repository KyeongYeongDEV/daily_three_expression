import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './adapter/in/auth.controller';
import { jwtConfig } from 'src/common/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from './adapter/out/jwt.adapter';
import { RedisAdapter } from './adapter/out/redis.adpter';
import { UserModule } from 'src/user/user.module';
import { RedisConfigModule } from 'src/common/config/config.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BatchModule } from 'src/batch/batch.module';


@Module({
  imports : [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
    forwardRef(() => BatchModule),
    RedisConfigModule,
    UserModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    RedisAdapter,
    {
      provide: 'RedisPort',
      useExisting: RedisAdapter,
    },
    JwtAdapter,
    {
      provide: 'JwtPort',
      useExisting: JwtAdapter,
    },
    {
      provide: 'AuthServicePort',
      useExisting: AuthService,
      
    },
    JwtStrategy
  ],
  controllers: [AuthController],
  exports : ['RedisPort', 'JwtPort','AuthServicePort']
})
export class AuthModule {}
