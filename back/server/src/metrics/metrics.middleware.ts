import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const timer = this.metricsService.startTimer();

    res.on('finish', () => {
      const method = req.method;
      const route = req.route?.path || req.path;
      const statusCode = res.statusCode;

      this.metricsService.countRequest(method, route, statusCode);
      this.metricsService.endTimer(timer, method, route, statusCode);
    });

    next();
  }
}
