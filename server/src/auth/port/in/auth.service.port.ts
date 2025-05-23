import { CreateTokenResponse, EmailResponse, LogoutResponse, VerifyTokenResponse } from "src/auth/dto/response.dto";

export interface AuthServicePort {
  createToken(u_id : number, email: string): Promise<CreateTokenResponse>;
  verifyToken(token: string): Promise<VerifyTokenResponse>;
  getEmailFromToken(token: string): Promise<EmailResponse>;
  logout(email: string): Promise<LogoutResponse>;
}
