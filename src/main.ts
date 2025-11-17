import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import pinoHttp from 'pino-http';
import logger from './common/logger/logger';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true, // Importante para obter IP real atrás de proxy
      bodyLimit: 1048576, // Limite de 1MB para body (proteção contra payload gigante)
    }),
  );
  app.setGlobalPrefix('api');
  // Registrar plugin de cookies
  await app.register(fastifyCookie as any, {
    secret:
      process.env.COOKIE_SECRET ||
      'connpet-cookie-secret-key-change-in-production',
  });

  // Helmet para segurança de headers HTTP
  await app.register(helmet as any, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'https:'],
        scriptSrc: [`'self'`],
      },
    },
  });

  // CORS configurado adequadamente
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    maxAge: 3600, // Cache de preflight
  });

  // Filtros e Interceptors Globais
  // app.useGlobalFilters(new AllExceptionsFilter()); // Captura todos os erros não tratados
  // MetricsInterceptor está registrado como APP_INTERCEPTOR no app.module
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // lança erro se houver propriedades extras
      transform: true, // transforma payload em instância do DTO
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  // app.use(pinoHttp({ logger }));

  // Configurar Swagger apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  // Log de inicialização
  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
