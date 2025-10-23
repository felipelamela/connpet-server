import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ErrorResponse } from '../response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';

interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

@Injectable()
export class BruteForceGuard implements CanActivate {
  // Armazenar tentativas de login por IP e email
  private loginAttempts: Map<string, LoginAttempt> = new Map();

  // Configurações
  private readonly MAX_ATTEMPTS = 5; // Máximo de tentativas
  private readonly ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutos
  private readonly BLOCK_DURATION = 30 * 60 * 1000; // 30 minutos de bloqueio

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    const email = request.body?.email || '';

    // Chave única: IP + Email (para prevenir múltiplos emails do mesmo IP)
    const key = `${ip}:${email}`;

    const attempt = this.loginAttempts.get(key);
    const now = Date.now();

    // Se está bloqueado
    if (attempt?.blockedUntil && now < attempt.blockedUntil) {
      const remainingMinutes = Math.ceil(
        (attempt.blockedUntil - now) / 1000 / 60,
      );

      console.warn(
        `🚫 Tentativa de login bloqueada: ${email} (IP: ${ip}) - ${remainingMinutes}min restantes`,
      );

      throw new ErrorResponse({
        message: `Conta temporariamente bloqueada por múltiplas tentativas de login.`,
        statusCode: 429,
        errorsCode: ErrorEnum.ACCOUNT_LOCKED,
        details: {
          email,
          blockedUntil: new Date(attempt.blockedUntil).toISOString(),
          // remainingMinutes,
        },
      });
    }

    // Se passou do tempo de janela, resetar contador
    if (attempt && now - attempt.lastAttempt > this.ATTEMPT_WINDOW) {
      this.loginAttempts.delete(key);
    }
    return true;
  }

  // Registrar atividade suspeita (alias para registerFailedAttempt)
  registerSuspiciousActivity(ip: string, email?: string): void {
    this.registerFailedAttempt(ip, email || 'unknown');
  }

  // Registrar falha de login
  registerFailedAttempt(ip: string, email: string): void {
    const key = `${ip}:${email}`;
    const attempt = this.loginAttempts.get(key) || {
      count: 0,
      lastAttempt: 0,
    };

    attempt.count++;
    attempt.lastAttempt = Date.now();

    // Se atingiu o limite, bloquear
    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.blockedUntil = Date.now() + this.BLOCK_DURATION;

      console.error(`
╔════════════════════════════════════════════════════════════╗
║  🚨 BLOQUEIO POR FORÇA BRUTA                              ║
╠════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(49)}║
║  IP: ${ip.padEnd(53)}║
║  Tentativas: ${String(attempt.count).padEnd(44)}║
║  Bloqueado até: ${new Date(attempt.blockedUntil).toLocaleString('pt-BR').padEnd(35)}║
╚════════════════════════════════════════════════════════════╝
      `);
    }

    this.loginAttempts.set(key, attempt);
  }

  // Limpar tentativas após login bem-sucedido
  clearAttempts(ip: string, email: string): void {
    const key = `${ip}:${email}`;
    this.loginAttempts.delete(key);
  }

  // Obter IP do cliente
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.ip ||
      request.connection?.remoteAddress ||
      'unknown'
    );
  }

  // Limpar tentativas antigas (executar periodicamente)
  cleanup(): void {
    const now = Date.now();
    for (const [key, attempt] of this.loginAttempts.entries()) {
      // Remover se:
      // 1. Passou do tempo de bloqueio E não há novas tentativas
      // 2. Passou muito tempo desde a última tentativa
      if (
        (attempt.blockedUntil && now > attempt.blockedUntil) ||
        now - attempt.lastAttempt > this.ATTEMPT_WINDOW * 2
      ) {
        this.loginAttempts.delete(key);
      }
    }

    console.log(
      `🧹 Cleanup: ${this.loginAttempts.size} tentativas de login em memória`,
    );
  }

  // Obter estatísticas
  getStats(): {
    totalAttempts: number;
    blockedIps: number;
    activeAttempts: number;
  } {
    let blockedCount = 0;
    const now = Date.now();

    for (const attempt of this.loginAttempts.values()) {
      if (attempt.blockedUntil && now < attempt.blockedUntil) {
        blockedCount++;
      }
    }

    return {
      totalAttempts: this.loginAttempts.size,
      blockedIps: blockedCount,
      activeAttempts: this.loginAttempts.size - blockedCount,
    };
  }
}

