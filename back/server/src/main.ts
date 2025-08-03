import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'metrics', method: 0 }],
  });

  app.enableCors({
    origin: true, 
    credentials: true, 
  });

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
