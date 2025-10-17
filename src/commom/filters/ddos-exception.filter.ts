import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { FastifyReply } from 'fastify';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';

@Catch(ThrottlerException)
export class DDoSExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    // Obter IP do cliente
    const ip =
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.ip ||
      'unknown';

    // Log detalhado
    console.error(`
╔════════════════════════════════════════════════════════════╗
║  🚨 POSSÍVEL ATAQUE DDoS DETECTADO                        ║
╠════════════════════════════════════════════════════════════╣
║  IP: ${ip.padEnd(50)}║
║  Rota: ${request.url.padEnd(48)}║
║  Método: ${request.method.padEnd(46)}║
║  Timestamp: ${new Date().toISOString().padEnd(38)}║
╚════════════════════════════════════════════════════════════╝
    `);

    // Calcular tempo de retry
    const retryAfter = 60; // 60 segundos

    // Criar erro no padrão do projeto
    const errorResponse = new ErrorResponse({
      message: 'Muitas requisições detectadas. Por favor, aguarde antes de tentar novamente.',
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      errorsCode: ErrorEnum.RATE_LIMIT_EXCEEDED,
      details: {
        retryAfter: `${retryAfter} segundos`,
        ip: ip.includes('.') ? ip.split('.').slice(0, 2).join('.') + '.***' : 'hidden',
        timestamp: new Date().toISOString(),
      },
    });

    response
      .status(HttpStatus.TOO_MANY_REQUESTS)
      .header('Retry-After', retryAfter.toString())
      .header('X-RateLimit-Limit', '100')
      .header('X-RateLimit-Remaining', '0')
      .header('X-RateLimit-Reset', String(Date.now() + retryAfter * 1000))
      .send({
        success: errorResponse.success,
        statusCode: errorResponse.statusCode,
        message: errorResponse.message,
        errorsCode: errorResponse.errorsCode,
        details: errorResponse.details,
      });
  }
}

