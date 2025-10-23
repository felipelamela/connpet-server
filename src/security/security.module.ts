import { Module, Global } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SmartThrottlerGuard } from '../commom/guards/smart-throttler.guard';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 20, // 20 requisições por segundo (aumentado para clínicas)
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos  
        limit: 100, // 100 requisições por 10 segundos (aumentado)
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 300, // 300 requisições por minuto (aumentado para múltiplos usuários)
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SmartThrottlerGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class SecurityModule {}

