import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, register, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private httpRequestCounter: Counter<string>;
  private httpRequestDuration: Histogram<string>;

  onModuleInit() {
    collectDefaultMetrics();

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'statusCode'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'statusCode'],
      buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 3, 5],
    });
  }

  countRequest(method: string, route: string, statusCode: number) {
    this.httpRequestCounter
      .labels(method, route, statusCode.toString())
      .inc();
  }

  startTimer() {
    return this.httpRequestDuration.startTimer(); // 라벨 없이 먼저 시작
  }

  endTimer(timer: ReturnType<Histogram<string>['startTimer']>, method: string, route: string, statusCode: number) {
    timer({ method, route, statusCode: statusCode.toString() });
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
