import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import promBundle from 'express-prom-bundle';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const metricsMiddleware = promBundle({ includeMethod: true });
  app.use(metricsMiddleware);

  app.use(cookieParser());

  app.enableCors({
    origin: true, 
    credentials: true, 
  });

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
