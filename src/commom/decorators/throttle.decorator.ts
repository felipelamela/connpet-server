import { SetMetadata } from '@nestjs/common';

export const THROTTLE_CUSTOM_KEY = 'throttle_custom';

// Decorator para configurar rate limiting customizado
export interface ThrottleConfig {
  limit: number; // Número máximo de requisições
  ttl: number; // Tempo em segundos
}

export const Throttle = (config: ThrottleConfig) =>
  SetMetadata(THROTTLE_CUSTOM_KEY, config);

// Decorators pré-configurados para casos comuns

// Strict: Para endpoints sensíveis (login, registro)
// 5 requisições por minuto
export const ThrottleStrict = () =>
  Throttle({
    limit: 5,
    ttl: 60,
  });

// Normal: Para endpoints normais
// 30 requisições por minuto
export const ThrottleNormal = () =>
  Throttle({
    limit: 30,
    ttl: 60,
  });

// Relaxed: Para endpoints de leitura
// 100 requisições por minuto
export const ThrottleRelaxed = () =>
  Throttle({
    limit: 100,
    ttl: 60,
  });

// Custom: Para configuração específica
export const ThrottleCustom = (limit: number, ttl: number) =>
  Throttle({ limit, ttl });

