import { LoginDto, ReissueDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/service/auth.service';
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
}
