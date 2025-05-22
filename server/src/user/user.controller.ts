import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
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

  @Post('verified/email') 
  async updateEmailVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateEmailVerified(userVerifiedUpdateRequestDto);
  }

  @Post('verified/subscribe') 
  async updateSubscribeVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateSubscribeVerified(userVerifiedUpdateRequestDto);
  }
} 