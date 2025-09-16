import { UserPort } from '../port/user.port';
import { UserEntity } from '../domain/user.entity';
import { UserInfoResponse } from '../../common/types/response.type';
import { UserRegisterRequestDto, UserEmailRequestDto, UserVerifiedUpdateRequestDto } from '../dto/request.dto';
import { RedisPort } from '../../auth/port/out/redis.port';
export declare class UserService {
    private readonly userPort;
    private readonly redisPort;
    findAllUsersEmail(): void;
    constructor(userPort: UserPort, redisPort: RedisPort);
    getUserInfoByUid(u_id: number): Promise<UserEntity>;
    getAllUsersEmail(): Promise<any>;
    isExistsUserByEmail(email: string): Promise<boolean>;
    private mapToUserEntity;
    registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserInfoResponse>;
    getUserInfoByEmail(userEmailRequestDto: UserEmailRequestDto): Promise<UserInfoResponse>;
    private updateUserVerifiedFlag;
    updateEmailVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
    updateSubscribeVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
    updateSubscribeStatus(email: string, token: string): Promise<UserInfoResponse>;
}
