
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { MetricsInterceptor } from './commom/interceptors/metrics.interceptor';
import { ResponseInterceptor } from './commom/interceptors/response.interceptor';
import pinoHttp from 'pino-http';
import logger from './commom/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors();
  app.useGlobalInterceptors(new MetricsInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // lança erro se houver propriedades extras
      transform: true,            // transforma payload em instância do DTO
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map(err => ({
          field: err.property,
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }));
  app.use(pinoHttp({ logger }));
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();  
