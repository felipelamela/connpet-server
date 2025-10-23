import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';

@Injectable()
export class SmartThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Obter IP do cliente
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';

    // SOLUÇÃO INTELIGENTE:
    // Se a requisição tem usuário autenticado, usar IP + userId
    // Se não tem (login, registro), usar IP + email do body
    // Isso permite múltiplos usuários do mesmo IP (mesma clínica)

    const user = req.user; // Vem do JwtAuthGuard
    const email = req.body?.email; // Vem do body (login, registro)

    if (user && user.id) {
      // Usuário autenticado: IP + UserId
      // Exemplo: "192.168.1.1:user-abc-123"
      // Permite 20 usuários diferentes do mesmo IP sem conflito
      return `${ip}:user-${user.id}`;
    } else if (email) {
      // Endpoint público com email (login): IP + Email
      // Exemplo: "192.168.1.1:joao@email.com"
      // Permite múltiplos emails diferentes do mesmo IP
      return `${ip}:email-${email}`;
    } else {
      // Endpoint público sem email (health, etc.): apenas IP
      // Exemplo: "192.168.1.1"
      // Aqui sim, conta todas as requisições do IP junto
      return ip;
    }
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const req = context.switchToHttp().getRequest();
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.ip ||
      'unknown';

    const user = req.user;
    const email = req.body?.email;

    // Log detalhado
    if (user) {
      console.warn(
        `⚠️  Rate limit: Usuário ${user.email} (${user.id}) - IP: ${ip}`,
      );
    } else if (email) {
      console.warn(`⚠️  Rate limit: Email ${email} - IP: ${ip}`);
    } else {
      console.warn(`⚠️  Rate limit: IP ${ip} (endpoint público)`);
    }

    throw new ErrorResponse({
      message:
        'Muitas requisições. Por favor, aguarde alguns segundos e tente novamente.',
      statusCode: 429,
      errorsCode: ErrorEnum.RATE_LIMIT_EXCEEDED,
      details: {
        ip: ip.includes('.') ? ip.split('.').slice(0, 2).join('.') + '.***' : 'hidden',
        timestamp: new Date().toISOString(),
        context: user ? 'authenticated' : 'public',
      },
    });
  }
}

