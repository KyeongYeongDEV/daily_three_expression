import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;
}

export class ReissueDto {
  @IsEmail()
  email: string;

  @IsString()
  refreshToken: string;
}