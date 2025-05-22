import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserEmailRequestDto, UserRegisterRequestDto, UserVerifiedUpdateRequestDto } from './dto/request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async registerUser(@Body() userRegisterRequestDto: UserRegisterRequestDto) {
    return this.userService.registerUser(userRegisterRequestDto);
  }

  @Post('email') 
  async getUserInfoByEmail(@Body() userEmailRequestDto: UserEmailRequestDto) {
    return this.userService.getUserInfoByEmail(userEmailRequestDto);
  }

  @Post('email/verified') 
  async updateEmailVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateEmailVerified(userVerifiedUpdateRequestDto);
  }

  @Post('email') 
  async updateSubscribeVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateSubscribeVerified(userVerifiedUpdateRequestDto);
  }
}