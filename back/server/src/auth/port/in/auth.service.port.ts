import { CreateTokenResponse, EmailResponse, LogoutResponse, VerifyTokenResponse } from "src/auth/dto/response.dto";
import { ResponseHelper } from "src/common/helpers/response.helper";

export interface AuthServicePort {
  createToken(u_id : number, email: string): Promise<CreateTokenResponse>;
  reissue(email: string, refreshToken: string): Promise<CreateTokenResponse>
  verifyToken(token: string): Promise<VerifyTokenResponse>;
  getEmailFromToken(token: string): Promise<EmailResponse>;
  logout(email: string): Promise<LogoutResponse>;
  sendEmailVerificationCode(email: string): Promise<string>;
  verifyEmailCode(email: string, code: string): Promise<ResponseHelper>;
}
