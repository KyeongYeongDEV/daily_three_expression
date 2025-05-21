
import { IsEmail, IsBoolean } from 'class-validator';

export class UserRequestDto {
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  // @IsBoolean({ message: '이메일 수신 여부는 true/false여야 합니다.' })
  // is_email_subscribed: boolean;
}