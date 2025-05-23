import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto, ReissueDto } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService : AuthService,
  ){}

  @Post('login')
  async login(@Body() loginDto : LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req : any) {
    return await this.authService.logout(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  async reissue(@Body() { email, refreshToken }: ReissueDto) {
    return await this.authService.reissue( email, refreshToken );
  }
}