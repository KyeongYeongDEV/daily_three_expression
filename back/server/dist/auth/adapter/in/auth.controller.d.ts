import { LoginDto, ReissueDto } from '../../../auth/dto/auth.dto';
import { AuthService } from '../../../auth/service/auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(res: Response, loginDto: LoginDto): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: any;
    }>;
    logout(req: any): Promise<import("../../dto/response.dto").LogoutResponse>;
    reissue({ email, refreshToken }: ReissueDto): Promise<import("../../dto/response.dto").CreateTokenResponse>;
    verifyToken({ email }: {
        email: string;
    }): Promise<string>;
    verifyCode({ email, code }: {
        email: string;
        code: string;
    }): Promise<any>;
}
