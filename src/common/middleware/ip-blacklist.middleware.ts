import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../../common/response/errorResponse';
import { ErrorEnum } from '../enum/error.enum';

@Injectable()
export class IpBlacklistMiddleware implements NestMiddleware {
  // Lista de IPs bloqueados (pode ser carregada de um banco de dados)
  private blacklist: Set<string> = new Set([
    // Exemplo: '192.168.1.100',
    // Adicione IPs maliciosos aqui
  ]);

  // Lista de IPs permitidos (whitelist - útil em produção)
  private whitelist: Set<string> = new Set([
    // Exemplo: '192.168.1.1', // IP da sua rede
    // Em produção, adicione IPs confiáveis
  ]);

  // Contador de tentativas por IP
  private attemptsByIp: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  // Limite de tentativas suspeitas
  private readonly MAX_FAILED_ATTEMPTS = 10;
  private readonly BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos
  private readonly ATTEMPT_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

  use(req: Request, res: Response, next: NextFunction) {
    const ip = this.getClientIp(req);

    // 1. Verificar whitelist primeiro (bypass)
    if (this.whitelist.size > 0 && this.whitelist.has(ip)) {
      return next();
    }

    // 2. Verificar blacklist permanente
    if (this.blacklist.has(ip)) {
      console.warn(`🚫 IP bloqueado tentou acessar: ${ip}`);

      throw new ErrorResponse({
        message: 'Acesso negado. IP bloqueado por atividade suspeita.',
        statusCode: 403,
        errorsCode: ErrorEnum.IP_BLOCKED,
        details: {
          ip: ip.includes('.')
            ? ip.split('.').slice(0, 2).join('.') + '.***'
            : 'hidden',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 3. Verificar bloqueio temporário
    const attempts = this.attemptsByIp.get(ip);
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

      // Se passou o tempo de bloqueio, resetar
      if (timeSinceLastAttempt > this.BLOCK_DURATION_MS) {
        this.attemptsByIp.delete(ip);
      }
      // Se ainda está bloqueado
      else if (attempts.count >= this.MAX_FAILED_ATTEMPTS) {
        const remainingTime = Math.ceil(
          (this.BLOCK_DURATION_MS - timeSinceLastAttempt) / 1000 / 60,
        );

        console.warn(
          `⏰ IP temporariamente bloqueado: ${ip} (${remainingTime} min restantes)`,
        );

        throw new ErrorResponse({
          message: `Muitas tentativas suspeitas. Tente novamente em ${remainingTime} minutos.`,
          statusCode: 429,
          errorsCode: ErrorEnum.TOO_MANY_REQUESTS,
          details: {
            ip: ip.includes('.')
              ? ip.split('.').slice(0, 2).join('.') + '.***'
              : 'hidden',
            remainingMinutes: remainingTime,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }

    next();
  }

  // Método para registrar tentativa suspeita (chamar após falha de login)
  registerSuspiciousActivity(ip: string) {
    const attempts = this.attemptsByIp.get(ip) || { count: 0, lastAttempt: 0 };
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;

    // Reset se passou da janela de tempo
    if (timeSinceLastAttempt > this.ATTEMPT_WINDOW_MS) {
      this.attemptsByIp.set(ip, { count: 1, lastAttempt: Date.now() });
    } else {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.attemptsByIp.set(ip, attempts);

      // Log de aviso
      if (attempts.count >= this.MAX_FAILED_ATTEMPTS / 2) {
        console.warn(`⚠️  IP suspeito: ${ip} (${attempts.count} tentativas)`);
      }

      // Bloquear se exceder o limite
      if (attempts.count >= this.MAX_FAILED_ATTEMPTS) {
      }
    }
  }

  // Método para adicionar IP à blacklist permanente
  addToBlacklist(ip: string) {
    this.blacklist.add(ip);
  }

  // Método para remover IP da blacklist
  removeFromBlacklist(ip: string) {
    this.blacklist.delete(ip);
  }

  // Método para adicionar IP à whitelist
  addToWhitelist(ip: string) {
    this.whitelist.add(ip);
  }

  // Obter IP real do cliente (considerando proxies)
  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }

  // Limpar tentativas antigas periodicamente (chamar via cron)
  cleanOldAttempts() {
    const now = Date.now();
    for (const [ip, data] of this.attemptsByIp.entries()) {
      if (now - data.lastAttempt > this.BLOCK_DURATION_MS) {
        this.attemptsByIp.delete(ip);
      }
    }
  }
}
