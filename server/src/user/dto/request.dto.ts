
import { IsEmail, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserEmailRequestDto {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;
}

export class UserRegisterRequestDto {
  @IsEmail({},{ message: '이메일 형식이 올바르지 않습니다.' })
  email : string;

  @IsBoolean({ message: '이메일 수신 여부는 true/false여야 합니다.' })
  is_email_subscribed: boolean;

  @IsBoolean({ message: '이메일 인증 여부는 true/false여야 합니다.' })
  is_email_verified: boolean;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}

export class UserVerifiedUpdateRequestDto {
  @IsInt({ message: 'u_id는 정수여야 합니다.' })
  @Min(1, { message: 'u_id는 1 이상의 값이어야 합니다.' })
  u_id: number;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'verified는 true 또는 false 값이어야 합니다.' })
  verified: boolean;
}
