import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Usar IP do cliente para tracking
    // Suporta proxy reverso (nginx, cloudflare)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';

    return ip;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const req = context.switchToHttp().getRequest();
    const ip = await this.getTracker(req);

    // Log de tentativa de DDoS
    console.warn(`⚠️  Rate limit exceeded for IP: ${ip}`);

    throw new ErrorResponse({
      message: 'Muitas requisições. Por favor, aguarde alguns segundos e tente novamente.',
      statusCode: 429,
      errorsCode: ErrorEnum.RATE_LIMIT_EXCEEDED,
      details: {
        ip: ip.includes('.') ? ip.split('.').slice(0, 2).join('.') + '.***' : 'hidden',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

