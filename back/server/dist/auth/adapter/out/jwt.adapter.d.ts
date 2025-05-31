import { JwtService } from "@nestjs/jwt";
import { JwtPort } from "src/auth/port/out/jwt.port";
export declare class JwtAdapter implements JwtPort {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    signAccessToken(payload: any): Promise<string>;
    signRefreshToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
    decodeToken(token: string): Promise<any>;
}
