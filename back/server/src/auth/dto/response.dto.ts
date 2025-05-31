interface ApiResponse<T> {
  success : boolean;
  statusCode : number;
  message : string;
  data : T | null;
}

export class AuthCreateTokenDTO {
  accessToken : string;
  refreshToken : string;
}

export type CreateTokenResponse = ApiResponse<AuthCreateTokenDTO>;
export type VerifyTokenResponse = ApiResponse<boolean>;
export type EmailResponse = ApiResponse<string>;
export type LogoutResponse = ApiResponse<void>;