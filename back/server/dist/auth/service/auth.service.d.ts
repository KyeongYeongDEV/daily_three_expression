import { AuthServicePort } from '../port/in/auth.service.port';
import { CreateTokenResponse, EmailResponse, LogoutResponse, VerifyTokenResponse } from '../dto/response.dto';
import { RedisPort } from '../port/out/redis.port';
import { JwtPort } from '../port/out/jwt.port';
import { UserService } from '../../user/service/user.service';
import { LoginDto } from '../dto/auth.dto';
import { Response } from 'express';
import { SendMailPort } from '../../mailer/port/out/send-mail.port';
import { UserEmailType, UsersWithUuidType } from '../../common/types/user.type';
export declare class AuthService implements AuthServicePort {
    private readonly redisPort;
    private readonly jwtPort;
    private readonly sendMailPort;
    private readonly userService;
    constructor(redisPort: RedisPort, jwtPort: JwtPort, sendMailPort: SendMailPort, userService: UserService);
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
    private generateOneDigit;
    private generateVerificationCode;
    sendEmailVerificationCode(email: string): Promise<string>;
    verifyEmailCode(email: string, code: string): Promise<any>;
    private generateUuidToken;
    createUuidTokenForEmails(users: UserEmailType[]): Promise<UsersWithUuidType[]>;
    createUuidToken(email: string): Promise<string>;
    verifyUuidToken(email: string, uuidToken: string): Promise<boolean>;
}
