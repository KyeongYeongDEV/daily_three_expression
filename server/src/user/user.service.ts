import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from './user.port';
import { UserEntity } from './user.entity';
import { UserInfoResponse } from 'src/common/types/response.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UserExistDTO } from './dto/response.dto';
import { UserRequestDto } from './dto/request.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {}

  private async getUserInfoByUid(u_id : number) : Promise<UserEntity> {
    const user : UserEntity | null = await this.userPort.findUserByUid(u_id);

    if(!user){
      throw new Error('사용자 정보 조회 실패');
    }

    return user;
  }

  private async isExistsUserByEmail( email : string ) : Promise<boolean> {
    const exists : UserExistDTO | null = await this.userPort.findUserByEmail(email);
    return !!exists; // null | undefinded = false, 객체가 있으면 true;
  }

  async registerUser(user: UserEntity): Promise<UserInfoResponse> {
    try {
      if(await this.isExistsUserByEmail(user.email)){
        throw new Error('이미 존재하는 회원입니다');
      }
      const result : UserEntity | null= await this.userPort.saveUser(user);
      if(!result){
        throw new Error('사용자 정보 저장 실패');
      }

      return ResponseHelper.success(result, '회원가입에 성공했습니다');
    } catch (error) {
      console.error('[registerUser] ', error);
      return ResponseHelper.fail('회원가입에 실패했습니다');
    }
  }

  async getUserInfoByEmail(userRequestDto: UserRequestDto): Promise<UserInfoResponse> {
    try {
      const result : UserEntity | null = await this.userPort.findUserInfoByEmail(userRequestDto.email);

      if(!result){
        throw new Error('사용자 정보 조회 실패');
      }

      return ResponseHelper.success(result, '회원정보 조회에 성공했습니다');
    } catch (error) {
      console.error('[getUserByEmail]' ,error);
      return ResponseHelper.fail('회원정보 조회에 실패했습니다.');
    }
  }



  async updateEmailVerified(u_id: number, verified: boolean): Promise<UserInfoResponse> {
    try {
      const user : UserEntity  = await this.getUserInfoByUid( u_id );

      user.is_email_verified = verified;
      user.updated_at = new Date();

      const result = await this.userPort.saveUser(user);
      
      return ResponseHelper.success(result, "이메일 인증 여부 수정을 성공했습니다.");
    } catch (error) {
      console.error('[updateEmailVerified] ', error);
      return ResponseHelper.fail("이메일 인증 여부 수정에 실패했습니다.");
    }
  }
  
  async updateSubscribeVerified(u_id: number, verified: boolean): Promise<UserInfoResponse> {
    try {
      const user : UserEntity  = await this.getUserInfoByUid( u_id );
  
      user.is_email_subscribed = verified;
      user.updated_at = new Date();

      const result = await this.userPort.saveUser(user);
      
      return ResponseHelper.success(result, "이메일 수신 동의 여부 정보 수정을 성공했습니다.");
    } catch (error) {
      console.error('[updateEmailVerified] ', error);
      return ResponseHelper.fail("이메일 수신 동의 여부 정보 수정에 실패했습니다.");
    }
  }
}