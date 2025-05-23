import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../../service/user.service';
import { UserEmailRequestDto, UserRegisterRequestDto, UserVerifiedUpdateRequestDto } from '../../dto/request.dto';


//TODO try/catch response 방식을 service에서 controller로 옮기기
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