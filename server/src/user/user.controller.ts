import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() user: UserEntity) {
    return this.userService.register(user);
  }

  @Get(':email') 
  async find(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
