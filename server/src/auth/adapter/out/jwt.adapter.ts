import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPort } from "src/auth/port/out/jwt.port";

@Injectable()
export class JwtAdapter implements JwtPort {
  constructor(
    private readonly jwtService : JwtService,
  ){}

  async signAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async signRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
}

