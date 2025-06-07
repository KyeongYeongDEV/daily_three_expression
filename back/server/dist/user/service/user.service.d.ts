import { UserPort } from '../port/user.port';
import { UserEntity } from '../domain/user.entity';
import { UserInfoResponse } from 'src/common/types/response.type';
import { UserRegisterRequestDto, UserEmailRequestDto, UserVerifiedUpdateRequestDto } from '../dto/request.dto';
import { RedisPort } from 'src/auth/port/out/redis.port';
export declare class UserService {
    private readonly userPort;
    private readonly redisPort;
    constructor(userPort: UserPort, redisPort: RedisPort);
    getUserInfoByUid(u_id: number): Promise<UserEntity>;
    isExistsUserByEmail(email: string): Promise<boolean>;
    private mapToUserEntity;
    registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserInfoResponse>;
    getUserInfoByEmail(userEmailRequestDto: UserEmailRequestDto): Promise<UserInfoResponse>;
    private updateUserVerifiedFlag;
    updateEmailVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
    updateSubscribeVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
}
