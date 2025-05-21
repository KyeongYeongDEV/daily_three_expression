import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('singup')
  async registerUser(@Body() user: UserEntity) {
    return this.userService.registerUser(user);
  }

  @Post('email') 
  async getUserInfoByEmail(@Body() email: string) {
    return this.userService.getUserInfoByEmail(email);
  }
}
