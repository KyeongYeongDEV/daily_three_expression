import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from '../port/user.port';
import { UserEntity } from '../domain/user.entity';
import { UserInfoResponse } from 'src/common/types/response.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UserExistDTO } from '../dto/response.dto';
import { UserRegisterRequestDto, UserEmailRequestDto, UserVerifiedUpdateRequestDto } from '../dto/request.dto';
import { RedisPort } from 'src/auth/port/out/redis.port';
import { isDuplicateKeyError } from 'src/common/utils/db-error.util';

@Injectable()
export class UserService {
  findAllUsersEmail() {
    throw new Error('Method not implemented.');
  }
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

  async getAllUsersEmail() : Promise<any> {
    try{
      const userEmails  = await this.userPort.findAllUsersEmail();

      return ResponseHelper.success(userEmails, '모든 회원들 이메일 정보 조회에 성공했습니다');
    } catch (error) {
      console.error('[getAllUsersEmail] ', error);
      return ResponseHelper.fail('이메일 조회에 실패했습니다.', 500);
    }
  }


  async isExistsUserByEmail( email : string ) : Promise<boolean> {
    const exists : UserExistDTO | null = await this.userPort.findUserByEmail(email);
    return !!exists; // null | undefinded = false, 객체가 있으면 true;
  }

  private mapToUserEntity(dto: UserRegisterRequestDto): UserEntity {
    const user = new UserEntity();
    user.email = dto.email;
    user.is_email_verified = dto.is_email_verified;
    user.is_email_subscribed = dto.is_email_subscribed;
    
    return user;
  }

  async registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserInfoResponse> {
    const { email } = userRegisterRequestDto;
  
    const isVerified = await this.redisPort.isVerifiedEmail(email);
    if (!isVerified) {
      return ResponseHelper.fail('이메일 인증이 필요합니다.', 400);
    }
  
    const user = this.mapToUserEntity(userRegisterRequestDto);
  
    try {
      const saved = await this.userPort.saveUser(user); 
      return ResponseHelper.success(saved, '회원가입에 성공했습니다');
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        const existing = await this.userPort.findUserInfoByEmail(email);
        if (!existing) {
          return ResponseHelper.fail('[registerUser] 회원을 찾을 수 없습니다.', 500);
        }
        if (existing.is_email_subscribed) {
          return ResponseHelper.fail('[registerUser] 이미 구독 중인 이메일입니다.', 409);
        }
        const updatedUser = await this.userPort.updateSubscribeStatus(email, true);
        return ResponseHelper.success(updatedUser ?? null, '구독이 재활성화 되었습니다.');
      }
      console.error('[registerUser] ', err);
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

  async updateSubscribeStatus(email: string, token: string): Promise<UserInfoResponse> {
    try {
      const savedToken = await this.redisPort.getUuidToken(email);
      if (!savedToken || savedToken !== token) {
        return ResponseHelper.fail('유효하지 않은 구독 해지 요청입니다.', 400);
      }
  
      await this.userPort.updateSubscribeStatus(email, false);
      await this.redisPort.deleteUuidToken(email);
  
      return ResponseHelper.success(null, '구독 해지에 성공했습니다.');
    } catch (error) {
      console.error('[unsubscribe] ', error);
      return ResponseHelper.fail('구독 해지에 실패했습니다.', 500);
    }
  }
  
}