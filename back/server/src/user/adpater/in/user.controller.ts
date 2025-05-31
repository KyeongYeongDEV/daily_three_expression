import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from '../../service/user.service';
import { UserEmailRequestDto, UserRegisterRequestDto, UserVerifiedUpdateRequestDto } from '../../dto/request.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';


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

  @UseGuards(JwtAuthGuard)
  @Post('verified/email') 
  async updateEmailVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateEmailVerified(userVerifiedUpdateRequestDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('verified/subscribe') 
  async updateSubscribeVerified(@Body() userVerifiedUpdateRequestDto : UserVerifiedUpdateRequestDto) {
    return this.userService.updateSubscribeVerified(userVerifiedUpdateRequestDto);
  }
} 