import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('ConnPet API')
    .setDescription('API para sistema de gestão veterinária ConnPet')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação e autorização')
    .addTag('clinic-vet', 'Gestão de clínicas veterinárias')
    .addTag('products', 'Gestão de produtos')
    .addTag('services', 'Gestão de serviços')
    .addTag('pets', 'Gestão de pets')
    .addTag('tutors', 'Gestão de tutores')
    .addTag('appointments', 'Gestão de consultas')
    .addTag('exams', 'Gestão de exames')
    .addTag('internations', 'Gestão de internações')
    .addTag('payments', 'Gestão de pagamentos')
    .addTag('plans', 'Gestão de planos')
    .addTag('health', 'Status e métricas do sistema')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT token stored in HttpOnly cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'ConnPet API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });
}
