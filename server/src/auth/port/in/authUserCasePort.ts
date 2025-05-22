export interface AuthUseCasePort {
  login( email : string ) : Promise<{ accessToken : string; refreshToken : string }>;
  register(email : string) : Promise<void>;
  verifyEmail(token : string) : Promise<boolean>;
}