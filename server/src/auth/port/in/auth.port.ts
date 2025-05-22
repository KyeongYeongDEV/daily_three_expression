import { UserToken } from "src/auth/domain/user.token";
import { LoginDto } from "src/auth/dto/login.dto";

export interface AuthUseCase {
  login(logindto : LoginDto) : Promise<UserToken>;
  reissueTokens(refreshToken : string) : Promise<UserToken>;
}