import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly requestCounter: Counter;

  constructor() {
    this.registry = new Registry();

    collectDefaultMetrics({ register: this.registry });

    this.requestCounter = new Counter({
      name: 'custom_request_count',
      help: '요청 수 카운터',
      labelNames: ['method', 'path'],
      registers: [this.registry],
    });
  }

  incrementRequestCount(method = 'GET', path = '/') {
    this.requestCounter.labels(method, path).inc();
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
}
