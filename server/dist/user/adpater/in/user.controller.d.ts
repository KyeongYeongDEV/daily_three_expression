import { UserService } from '../../service/user.service';
import { UserEmailRequestDto, UserRegisterRequestDto, UserVerifiedUpdateRequestDto } from '../../dto/request.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    registerUser(userRegisterRequestDto: UserRegisterRequestDto): Promise<import("../../../common/types/response.type").UserInfoResponse>;
    getUserInfoByEmail(userEmailRequestDto: UserEmailRequestDto): Promise<import("../../../common/types/response.type").UserInfoResponse>;
    updateEmailVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<import("../../../common/types/response.type").UserInfoResponse>;
    updateSubscribeVerified(userVerifiedUpdateRequestDto: UserVerifiedUpdateRequestDto): Promise<import("../../../common/types/response.type").UserInfoResponse>;
}
