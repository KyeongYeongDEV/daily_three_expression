import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRequestDto } from './dto/request.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async registerUser(@Body() user: UserEntity) {
    return this.userService.registerUser(user);
  }

  @Post('email') 
  async getUserInfoByEmail(@Body() userRequestDto: UserRequestDto) {
    return this.userService.getUserInfoByEmail(userRequestDto);
  }

  @Post('email/verified') 
  async updateEmailVerified(@Body() u_id: number, verified: boolean) {
    return this.userService.updateEmailVerified(u_id, verified);
  }

  @Post('email') 
  async updateSubscribeVerified(@Body() u_id: number, verified: boolean) {
    return this.userService.updateSubscribeVerified(u_id, verified);
  }
}
