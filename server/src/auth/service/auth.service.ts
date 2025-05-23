
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthServicePort } from '../port/in/auth.service.port';
import { CreateTokenResponse, EmailResponse, LogoutResponse, VerifyTokenResponse } from '../dto/response.dto';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { RedisPort } from '../port/out/redis.port';
import { JwtPort } from '../port/out/jwt.port';
import { error } from 'console';
import { UserService } from 'src/user/service/user.service';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @Inject('RedisPort')
    private readonly redisPort : RedisPort,
    @Inject('JwtPort')
    private readonly jwtPort : JwtPort,
    private readonly userService : UserService,
  ) {}

  async createToken(u_id: number, email: string): Promise<CreateTokenResponse> {
    try {
      const payload = { u_id, email };

      const accessToken = await this.jwtPort.signAccessToken(payload);
      const refreshToken = await this.jwtPort.signRefreshToken(payload);

      await this.redisPort.saveRefreshToken(email, refreshToken);

      return ResponseHelper.success({accessToken, refreshToken}, '토큰 생성에 성공했습니다');
    } catch (error) {
      console.error('[createToken] ', error);
      return ResponseHelper.fail('토큰 생성에 실패했습니다')
    }
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      await this.jwtPort.verifyToken(token);
      return ResponseHelper.success(true, '유효한 토큰입니다')
    } catch {
      console.error('[verifyToken] ', error);
      return ResponseHelper.fail('토큰 확인 중 문제가 발생했습니다');
    }
  }

  async reissue(email: string, refreshToken: string): Promise<CreateTokenResponse> {
    try {
      const savedToken = await this.redisPort.getRefreshToken(email);
  
      if (!savedToken || savedToken !== refreshToken) {
        throw new Error('리프레시 토큰이 일치하지 않습니다.');
      }
  
      const newAccessToken = await this.jwtPort.signAccessToken({ email });
  
      return ResponseHelper.success({ accessToken: newAccessToken, refreshToken }, '액세스 토큰 재발급 성공');
    } catch (error) {
      console.error('[reissue]', error);
      return ResponseHelper.fail('토큰 재발급에 실패했습니다.');
    }
  }

  async getEmailFromToken(token: string): Promise<EmailResponse> {
    try {
      const decoded = await this.jwtPort.decodeToken(token);
      return ResponseHelper.success(decoded, '토큰에서 이메일 추출에 성공했습니다.')
    } catch (error) {
      console.error('[getEmailFromToken] ', error);
      return ResponseHelper.fail('토큰에서 이메일 추출 중 에러가 발생했습니다.');
    }
  }

  async logout(email: string): Promise<LogoutResponse> {
    try {
      await this.redisPort.deleteRefreshToken(email);
      return ResponseHelper.success(null, '로그아웃에 성공했습니다.');
    } catch (error) {
      console.error('[logout]', error);
      return ResponseHelper.fail('로그아웃 중 에러가 발생했습니다.'); 
    }
  } 

  async login(loginDto : LoginDto) {
      try {
        const user = (await this.userService.getUserInfoByEmail(loginDto)).data;
  
        if(!user) {throw new Error("user가 null 입니다")};
        if (!user.is_email_verified) throw new UnauthorizedException('이메일 인증되지 않음');
  
        const tokens = await this.createToken(user.u_id, user.email);
        return ResponseHelper.success(tokens, '로그인 성공');
      } catch (e) {
        return ResponseHelper.fail('로그인 실패');
      }
    }
}
