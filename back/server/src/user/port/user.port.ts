import { UserExistDTO } from '../dto/response.dto';
import { UserEntity } from '../domain/user.entity';
import { UserEmailType } from 'src/common/types/user.type';

export interface UserPort {
  findUserByEmail( email: string): Promise<UserExistDTO | null>;
  findUserInfoByEmail( email: string ): Promise<UserEntity | null>;
  saveUser( user: UserEntity ): Promise<UserEntity>;
  findUserByUid( id : number ): Promise<UserEntity | null>;
  findAllUsersEmail() : Promise<UserEmailType[]>;
  updateSubscribeStatus( email : string, is_email_subscribed: boolean ): Promise<void>;
}
