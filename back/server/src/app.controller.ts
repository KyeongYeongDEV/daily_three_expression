import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/')
  getHome(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>docker action page</h1>');
  }
}
