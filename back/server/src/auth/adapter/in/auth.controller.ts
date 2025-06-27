import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginDto, ReissueDto } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuthService } from 'src/auth/service/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService : AuthService,
  ){}

  @Post('login')
  async login(
    @Res({ passthrough: true }) res : Response,
    @Body() loginDto : LoginDto
  ) {
    return await this.authService.login(loginDto, res)
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req : any) {
    return await this.authService.logout(req.user.email);
  }

  @Post('reissue')
  async reissue(@Body() { email, refreshToken }: ReissueDto) {
    return await this.authService.reissue( email, refreshToken );
  }

  @Post('email/code/send')
  async verifyToken(@Body(){ email } : { email: string }) {
    return this.authService.sendEmailVerificationCode(email);
  }

  @Post('email/code/verify')
  async verifyCode(@Body() { email, code }: { email: string, code: string }) {
    return this.authService.verifyEmailCode(email, code);
  }
}  