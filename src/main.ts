
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { ErrorResponseInterceptor } from './interceptors/Error.interceptor';
import pinoHttp from 'pino-http';
import logger from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors();
  app.useGlobalInterceptors(new MetricsInterceptor());
  app.useGlobalInterceptors(new ErrorResponseInterceptor());
  app.useGlobalPipes(    
    new ValidationPipe({
      whitelist: true,            // remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // lança erro se houver propriedades extras
      transform: true,            // transforma payload em instância do DTO
  }));
  app.use(pinoHttp({ logger }));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();  
