import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './adapter/in/auth.controller';
import { jwtConfig } from 'src/common/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { RedisJwtAuthAdapter } from './adapter/out/redis-jwt-auth.adapter';

@Module({
  imports : [JwtModule.register(jwtConfig)],
  providers: [
    AuthService,
    RedisJwtAuthAdapter,
    {
      provide: 'AuthTokenPort',
      useExisting: RedisJwtAuthAdapter,
    },
  ],
  controllers: [AuthController],
  exports : ['AuthTokenPort']
})
export class AuthModule {}
