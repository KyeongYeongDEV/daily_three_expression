import { Inject, Injectable } from '@nestjs/common';
import { UserPort } from './user.port';
import { UserEntity } from './user.entity';
import { UserInfoResponse, UserRegisterResponse } from 'src/common/types/response.type';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { UserExistDTO } from './dto/response.dto';
import { UserRequestDto } from './dto/request.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserPort')
    private readonly userPort: UserPort,
  ) {}

  private async isExistsUser(email : string) : Promise<boolean> {
    const exists : UserExistDTO | null = await this.userPort.findUserByEmail(email);
    return !!exists; // null | undefinded = false, 객체가 있으면 true;
  }
  async registerUser(user: UserRequestDto): Promise<UserRegisterResponse> {
    try {
      if(await this.isExistsUser(user.email)){
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

  async getUserInfoByEmail(email: string): Promise<UserInfoResponse> {
    try {
      const result : UserEntity | null = await this.userPort.findUserInfoByEmail(email);

      if(!result){
        throw new Error('사용자 정보 조회 실패');
      }

      return ResponseHelper.success(result, '회원정보 조회에 성공했습니다');
    } catch (error) {
      console.error('[getUserByEmail]' ,error);
      return ResponseHelper.fail('회원정보 조회에 실패했습니다.');
    }
  }
}