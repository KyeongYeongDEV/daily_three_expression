import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from '../port/user.port';
import { UserEntity } from '../domain/user.entity';
import { UserInfoResponse } from 'src/common/types/response.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UserExistDTO } from '../dto/response.dto';
import { UserRegisterRequestDto, UserEmailRequestDto, UserVerifiedUpdateRequestDto } from '../dto/request.dto';
import { RedisPort } from 'src/auth/port/out/redis.port';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserPort')
    private readonly userPort: UserPort,
    @Inject('RedisPort')
    private readonly redisPort : RedisPort,
  ) {}

  async getUserInfoByUid(u_id : number) : Promise<UserEntity> {
    const user : UserEntity | null = await this.userPort.findUserByUid(u_id);

    if(!user){
      throw new Error('사용자 정보 조회 실패');
    }

    return user;
  }

  async isExistsUserByEmail( email : string ) : Promise<boolean> {
    const exists : UserExistDTO | null = await this.userPort.findUserByEmail(email);
    return !!exists; // null | undefinded = false, 객체가 있으면 true;
  }

  private mapToUserEntity(dto: UserRegisterRequestDto): UserEntity {
    const current = new Date();

    const user = new UserEntity();
    user.email = dto.email;
    user.is_email_verified = dto.is_email_verified;
    user.is_email_subscribed = dto.is_email_subscribed;
    user.created_at = current;
    user.updated_at = current;
    
    return user;
  }

  // TODO : 회원가입하는 데 시간이 오래 걸림 -> 개선하기
  async registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserInfoResponse> {
    try {
      const { email } = userRegisterRequestDto;
  
      if (await this.isExistsUserByEmail(email)) {
        return ResponseHelper.fail('이미 존재하는 회원입니다.', 400);
      }
  
      const isVerified = await this.redisPort.isVerifiedEmail(email);
      if (!isVerified) {
        return ResponseHelper.fail('이메일 인증이 필요합니다.', 400);
      }
  
      const user = this.mapToUserEntity(userRegisterRequestDto);
      const saved = await this.userPort.saveUser(user);
      if (!saved) {
        return ResponseHelper.fail('사용자 정보 저장 실패', 500);
      }
  
      this.redisPort.deleteVerifiedEmail(email).catch((err) => {
        console.error(`[Redis 삭제 실패] ${email}`, err);
      });      
      
      console.log(`[회원가입] ${email} 회원가입 성공!`);
      return ResponseHelper.success(saved, '회원가입에 성공했습니다');
    } catch (error) {
      console.error('[registerUser] ', error);
      return ResponseHelper.fail('회원가입에 실패했습니다', 500);
    }
  }

  async getUserInfoByEmail(userEmailRequestDto: UserEmailRequestDto): Promise<UserInfoResponse> {
    try {
      const result : UserEntity | null = await this.userPort.findUserInfoByEmail(userEmailRequestDto.email);

      if(!result){
        throw new Error('사용자 정보 조회 실패');
      }

      return ResponseHelper.success(result, '회원정보 조회에 성공했습니다');
    } catch (error) {
      console.error('[getUserByEmail]' ,error);
      return ResponseHelper.fail('회원정보 조회에 실패했습니다.', 400);
    }
  }

  private async updateUserVerifiedFlag(
    u_id: number,
    field: 'is_email_verified' | 'is_email_subscribed',
    value: boolean,
  ): Promise<UserInfoResponse> {
    try {
      const user = await this.getUserInfoByUid(u_id);
      user[field] = value;
      user.updated_at = new Date();
  
      const result = await this.userPort.saveUser(user);
      return ResponseHelper.success(result, `${field} 필드 수정에 성공했습니다.`);
    } catch (error) {
      console.error(`[updateUserVerifiedFlag] ${field} 변경 실패:`, error);
      return ResponseHelper.fail(`${field} 필드 수정에 실패했습니다.`, 400);
    }
  }

  async updateEmailVerified(userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto): Promise<UserInfoResponse> {
    return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_verified', userVerifiedUpdateRequestDto.verified)
  }
  
  async updateSubscribeVerified(userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto): Promise<UserInfoResponse> {
    return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_subscribed', userVerifiedUpdateRequestDto.verified)
  }
  
}