import { AuthServicePort } from '../port/in/auth.service.port';
import { CreateTokenResponse, EmailResponse, LogoutResponse, VerifyTokenResponse } from '../dto/response.dto';
import { RedisPort } from '../port/out/redis.port';
import { JwtPort } from '../port/out/jwt.port';
import { UserService } from 'src/user/service/user.service';
import { LoginDto } from '../dto/auth.dto';
import { Response } from 'express';
export declare class AuthService implements AuthServicePort {
    private readonly redisPort;
    private readonly jwtPort;
    private readonly userService;
    constructor(redisPort: RedisPort, jwtPort: JwtPort, userService: UserService);
    createToken(u_id: number, email: string): Promise<CreateTokenResponse>;
    verifyToken(token: string): Promise<VerifyTokenResponse>;
    reissue(email: string, refreshToken: string): Promise<CreateTokenResponse>;
    getEmailFromToken(token: string): Promise<EmailResponse>;
    logout(email: string): Promise<LogoutResponse>;
    login(loginDto: LoginDto, res: Response): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
        data: any;
    }>;
}
