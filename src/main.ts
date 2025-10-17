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
import helmet from '@fastify/helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true, // Importante para obter IP real atrás de proxy
      bodyLimit: 1048576, // Limite de 1MB para body (proteção contra payload gigante)
    }),
  );

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
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    maxAge: 3600, // Cache de preflight
  });
  app.useGlobalInterceptors(new MetricsInterceptor());
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
  app.use(pinoHttp({ logger }));

  // Log de inicialização
  const port = process.env.PORT ?? 5000;
  await app.listen(port, '0.0.0.0');

  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🐾 ConnPet Server Iniciado com Sucesso!                   ║
╠════════════════════════════════════════════════════════════╣
║  🌐 Porta: ${String(port).padEnd(49)}║
║  🛡️  Proteções Ativas:                                     ║
║     ✅ Rate Limiting (100 req/min)                         ║
║     ✅ Brute Force Protection (5 tentativas)               ║
║     ✅ Helmet Security Headers                             ║
║     ✅ CORS Configurado                                    ║
║     ✅ Body Limit (1MB)                                    ║
║     ✅ IP Tracking                                         ║
╚════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
