import { UserPort } from '../port/user.port';
import { UserInfoResponse } from 'src/common/types/response.type';
import { UserRegisterRequestDto, UserEmailRequestDto, UserVerifiedUpdateRequestDto } from '../dto/request.dto';
export declare class UserService {
    private readonly userPort;
    constructor(userPort: UserPort);
    private getUserInfoByUid;
    private isExistsUserByEmail;
    private mapToUserEntity;
    registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<UserInfoResponse>;
    getUserInfoByEmail(userEmailRequestDto: UserEmailRequestDto): Promise<UserInfoResponse>;
    private updateUserVerifiedFlag;
    updateEmailVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
    updateSubscribeVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<UserInfoResponse>;
}
