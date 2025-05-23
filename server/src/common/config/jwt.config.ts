// src/config/jwt.config.ts
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'supersecretkey',
  signOptions: { expiresIn: '15m' }, // 기본 accessToken 기준
};
