import { UserExistDTO } from './dto/response.dto';
import { UserEntity } from './user.entity';

export interface UserPort {
  findUserByEmail( email: string): Promise<UserExistDTO | null>;
  findUserInfoByEmail( email: string ): Promise<UserEntity | null>;
  saveUser( user: UserEntity ): Promise<UserEntity>;
  findUserByUid( id : number ): Promise<UserEntity | null>;
}
