# 🛡️ Proteção Contra DDoS e Ataques - ConnPet Server

## ✅ Implementações de Segurança

### 🚀 O que foi implementado:

1. ✅ **Rate Limiting Global** (Throttler)
2. ✅ **Proteção contra Força Bruta** (Brute Force Guard)
3. ✅ **Blacklist/Whitelist de IPs**
4. ✅ **Headers de Segurança** (Helmet)
5. ✅ **Limite de Payload** (1MB)
6. ✅ **CORS Configurado**
7. ✅ **Logging de Ataques**
8. ✅ **Exception Filter Customizado**

---

## 📦 Dependências Instaladas

```bash
npm install @nestjs/throttler @fastify/helmet @fastify/rate-limit
```

---

## 🔒 1. Rate Limiting Global

### Arquivo: `src/security/security.module.ts`

**Configuração em 3 níveis:**

```typescript
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,  // 1 segundo
    limit: 10,  // 10 requisições/segundo
  },
  {
    name: 'medium',
    ttl: 10000, // 10 segundos
    limit: 50,  // 50 requisições/10seg
  },
  {
    name: 'long',
    ttl: 60000, // 1 minuto
    limit: 100, // 100 requisições/minuto
  },
])
```

**Proteção:**
- ✅ Máximo de **10 requisições por segundo**
- ✅ Máximo de **50 requisições em 10 segundos**
- ✅ Máximo de **100 requisições por minuto**
- ✅ Bloqueia automaticamente se exceder

---

## 🚫 2. Proteção Contra Força Bruta

### Arquivo: `src/commom/guards/brute-force.guard.ts`

**Para Login:**
- ✅ Máximo **5 tentativas** de login errado
- ✅ Janela de **15 minutos**
- ✅ Bloqueio de **30 minutos** após exceder
- ✅ Tracking por **IP + Email**

**Como usar:**

```typescript
// No AuthController
import { BruteForceGuard } from '../commom/guards/brute-force.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private bruteForceGuard: BruteForceGuard
  ) {}

  @Post('login')
  @UseGuards(BruteForceGuard)
  async login(@Body() loginDto: LoginDto, @Req() request) {
    const ip = this.getClientIp(request);

    try {
      const result = await this.authService.login(loginDto);
      
      // Login bem-sucedido - limpar tentativas
      this.bruteForceGuard.clearAttempts(ip, loginDto.email);
      
      return result;
    } catch (error) {
      // Login falhou - registrar tentativa
      this.bruteForceGuard.registerSuspiciousActivity(ip);
      throw error;
    }
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.ip ||
      'unknown'
    );
  }
}
```

---

## 🎯 3. Throttle Customizado por Endpoint

### Arquivo: `src/commom/decorators/throttle.decorator.ts`

**Decorators disponíveis:**

```typescript
// Endpoints sensíveis (Login, Registro, Pagamentos)
@ThrottleStrict()  // 5 req/min
async sensitiveEndpoint() {}

// Endpoints normais (CRUD)
@ThrottleNormal()  // 30 req/min
async normalEndpoint() {}

// Endpoints de leitura (GET)
@ThrottleRelaxed() // 100 req/min
async readEndpoint() {}

// Custom
@ThrottleCustom(20, 60) // 20 req por 60 segundos
async customEndpoint() {}
```

**Exemplo de uso:**

```typescript
import { ThrottleStrict, ThrottleNormal } from '../commom/decorators/throttle.decorator';

@Controller('auth')
export class AuthController {
  
  @Post('login')
  @ThrottleStrict() // Apenas 5 tentativas por minuto
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ThrottleNormal() // 30 requisições por minuto
  async getProfile(@User() user) {
    return this.authService.getProfile(user.id);
  }
}
```

---

## 🚷 4. IP Blacklist/Whitelist

### Arquivo: `src/commom/middleware/ip-blacklist.middleware.ts`

**Funcionalidades:**

```typescript
// Bloquear IP permanentemente
ipBlacklistMiddleware.addToBlacklist('192.168.1.100');

// Permitir IP (bypass de rate limit)
ipBlacklistMiddleware.addToWhitelist('192.168.1.1');

// Remover bloqueio
ipBlacklistMiddleware.removeFromBlacklist('192.168.1.100');

// Limpar tentativas antigas
ipBlacklistMiddleware.cleanOldAttempts();

// Ver estatísticas
const stats = ipBlacklistMiddleware.getStats();
console.log(stats);
// { totalAttempts: 10, blockedIps: 2, activeAttempts: 8 }
```

**Como aplicar:**

```typescript
// No app.module.ts ou em um módulo específico
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpBlacklistMiddleware)
      .forRoutes('*'); // Aplicar em todas as rotas
  }
}
```

---

## 🪖 5. Helmet - Security Headers

### Arquivo: `src/main.ts`

**Headers de segurança configurados:**

- ✅ `Content-Security-Policy` - Previne XSS
- ✅ `X-Frame-Options` - Previne clickjacking
- ✅ `X-Content-Type-Options` - Previne MIME sniffing
- ✅ `Strict-Transport-Security` - Force HTTPS
- ✅ `X-XSS-Protection` - Proteção XSS adicional

---

## 📝 6. Limite de Payload

```typescript
FastifyAdapter({
  bodyLimit: 1048576, // 1MB máximo
})
```

**Proteção:**
- ✅ Previne upload de arquivos gigantes
- ✅ Previne JSON bombs
- ✅ Economiza memória

---

## 🌐 7. CORS Configurado

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  maxAge: 3600,
});
```

**Configurar no `.env`:**
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://seu-dominio.com
```

---

## 📊 8. Exception Filter para DDoS

### Arquivo: `src/commom/filters/ddos-exception.filter.ts`

**Quando rate limit é excedido:**

```json
{
  "statusCode": 429,
  "message": "Muitas requisições detectadas. Aguarde antes de tentar novamente.",
  "error": "Too Many Requests",
  "retryAfter": "60 segundos",
  "ip": "192.168.***",
  "timestamp": "2025-10-17T22:30:00.000Z"
}
```

**Headers de resposta:**
- `Retry-After: 60`
- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 0`
- `X-RateLimit-Reset: 1729200660000`

**Logs formatados:**
```
╔════════════════════════════════════════════════════════════╗
║  🚨 POSSÍVEL ATAQUE DDoS DETECTADO                        ║
╠════════════════════════════════════════════════════════════╣
║  IP: 192.168.1.100                                        ║
║  Rota: /api/auth/login                                    ║
║  Método: POST                                             ║
║  Timestamp: 2025-10-17T22:30:00.000Z                      ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎯 Como Usar nos Controllers

### Exemplo Completo - AuthController

```typescript
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ThrottleStrict } from '../commom/decorators/throttle.decorator';
import { BruteForceGuard } from '../commom/guards/brute-force.guard';
import { Public } from '../commom/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private bruteForceGuard: BruteForceGuard,
  ) {}

  // Login - Máxima proteção
  @Post('login')
  @Public()
  @ThrottleStrict() // 5 req/min
  @UseGuards(BruteForceGuard) // Proteção força bruta
  async login(@Body() loginDto: LoginDto, @Req() request) {
    const ip = this.getClientIp(request);

    try {
      const result = await this.authService.login(loginDto);
      this.bruteForceGuard.clearAttempts(ip, loginDto.email);
      return result;
    } catch (error) {
      this.bruteForceGuard.registerSuspiciousActivity(ip);
      throw error;
    }
  }

  // Registro - Proteção média
  @Post('register')
  @Public()
  @ThrottleStrict() // 5 req/min
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Recuperar senha - Proteção para evitar spam
  @Post('forgot-password')
  @Public()
  @ThrottleCustom(3, 300) // 3 req a cada 5 minutos
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.ip ||
      'unknown'
    );
  }
}
```

### Exemplo - Outros Controllers

```typescript
import { ThrottleNormal, ThrottleRelaxed } from '../commom/decorators/throttle.decorator';

@Controller('pets')
export class PetsController {
  
  // Endpoints de leitura - Limite relaxado
  @Get()
  @ThrottleRelaxed() // 100 req/min
  async findAll() {
    return this.petsService.findAll();
  }

  // Endpoints de escrita - Limite normal
  @Post()
  @ThrottleNormal() // 30 req/min
  async create(@Body() createDto: CreatePetDto) {
    return this.petsService.create(createDto);
  }

  // Endpoint sensível - Upload de arquivo
  @Post(':id/photo')
  @ThrottleStrict() // 5 req/min
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file) {
    return this.petsService.uploadPhoto(id, file);
  }
}
```

---

## ⚙️ Configuração do .env

Adicione ao seu arquivo `.env`:

```env
# Segurança
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://seu-dominio.com
JWT_SECRET=sua-chave-secreta-super-segura
PORT=5000

# Rate Limiting (opcional - já tem defaults)
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Logs
LOG_LEVEL=info
```

---

## 🧪 Como Testar a Proteção

### Teste 1: Rate Limiting

```bash
# Fazer 150 requisições rápidas
for i in {1..150}; do
  curl http://localhost:5000/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"123"}' &
done

# Resultado esperado:
# Primeiras 100: OK (200/401)
# Próximas 50: 429 Too Many Requests
```

### Teste 2: Brute Force

```bash
# Tentar login com senha errada 6 vezes
for i in {1..6}; do
  echo "Tentativa $i"
  curl http://localhost:5000/api/auth/login \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"senha-errada"}'
  sleep 1
done

# Resultado esperado:
# Tentativas 1-5: 401 Unauthorized
# Tentativa 6+: 429 Too Many Requests + Bloqueio de 30min
```

### Teste 3: Payload Grande

```bash
# Tentar enviar payload maior que 1MB
dd if=/dev/zero bs=2M count=1 | \
  curl http://localhost:5000/api/pets \
    -X POST \
    -H "Content-Type: application/json" \
    -d @-

# Resultado esperado:
# 413 Payload Too Large
```

---

## 📈 Monitoramento

### Ver Métricas de Rate Limiting

```bash
# Acessar métricas Prometheus
curl http://localhost:5000/metrics | grep http_request

# Ver tentativas de login bloqueadas
tail -f logs/connpet-server.log | grep "BLOQUEIO"
```

### Dashboard de Segurança (Implementar)

```typescript
// Criar endpoint admin para ver stats
@Get('admin/security/stats')
@Roles('ADMIN')
async getSecurityStats() {
  return {
    bruteForce: this.bruteForceGuard.getStats(),
    ipBlacklist: this.ipBlacklistMiddleware.getStats(),
    timestamp: new Date().toISOString(),
  };
}
```

---

## 🔧 Configurações Avançadas

### Ajustar Limites por Ambiente

```typescript
// src/security/security.module.ts

const isProduction = process.env.NODE_ENV === 'production';

ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: isProduction ? 5 : 10, // Mais restritivo em produção
  },
  {
    name: 'long',
    ttl: 60000,
    limit: isProduction ? 60 : 100,
  },
]),
```

### Whitelist para IPs Confiáveis

```typescript
// Adicionar IPs de servidores/parceiros confiáveis
const trustedIPs = [
  '192.168.1.1',      // Servidor interno
  '10.0.0.1',         // Load balancer
  '203.0.113.0/24',   // Range de IPs do parceiro
];

// No middleware
trustedIPs.forEach(ip => {
  ipBlacklistMiddleware.addToWhitelist(ip);
});
```

### Integração com Redis (Produção)

Para ambientes com múltiplos servidores, use Redis:

```bash
npm install @nestjs/throttler-storage-redis ioredis
```

```typescript
// security.module.ts
import { ThrottlerStorageRedisService } from '@nestjs/throttler-storage-redis';
import Redis from 'ioredis';

ThrottlerModule.forRoot({
  throttlers: [...],
  storage: new ThrottlerStorageRedisService(
    new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    })
  ),
}),
```

---

## 🚨 Alertas e Notificações

### Integrar com Sistema de Alertas

```typescript
// Criar service de alertas
@Injectable()
export class AlertService {
  async sendDDoSAlert(ip: string, details: any) {
    // Enviar email para admin
    // Enviar para Slack/Discord
    // Registrar no banco de dados
    // Acionar CloudFlare/AWS WAF
  }
}

// No DDoSExceptionFilter
catch(exception: ThrottlerException, host: ArgumentsHost) {
  // ... código existente ...
  
  // Enviar alerta se for ataque severo
  if (requestsPerMinute > 500) {
    this.alertService.sendDDoSAlert(ip, {
      requestsPerMinute,
      route: request.url,
      timestamp: new Date(),
    });
  }
}
```

---

## 📊 Níveis de Proteção Recomendados

### Por Tipo de Endpoint

| Endpoint | Limite | TTL | Motivo |
|----------|--------|-----|--------|
| Login | 5 | 60s | Prevenir força bruta |
| Registro | 3 | 300s | Evitar spam de contas |
| Recuperar Senha | 3 | 300s | Evitar spam de emails |
| Upload Arquivo | 5 | 60s | Proteção de storage |
| Pagamentos | 10 | 60s | Operações críticas |
| GET Lists | 100 | 60s | Leitura leve |
| POST/PUT/DELETE | 30 | 60s | Escrita moderada |
| Public APIs | 50 | 60s | Acesso público |

---

## 🛡️ Proteções Adicionais Recomendadas

### 1. CloudFlare (Grátis)
```
- DDoS Protection automático
- CDN global
- SSL grátis
- WAF (Web Application Firewall)
- Bot protection
```

### 2. Nginx como Reverse Proxy

```nginx
# /etc/nginx/sites-available/connpet

# Limite de conexões por IP
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_req_zone $binary_remote_addr zone=req_limit:10m rate=10r/s;

server {
  listen 80;
  server_name api.connpet.com;

  # Rate limiting
  limit_conn addr 10;  # Max 10 conexões simultâneas por IP
  limit_req zone=req_limit burst=20 nodelay; # Max 10 req/s com burst de 20

  # Tamanho máximo do body
  client_max_body_size 1M;

  # Timeout
  client_body_timeout 10s;
  client_header_timeout 10s;

  # Proxy para NestJS
  location / {
    proxy_pass http://localhost:5000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

### 3. Fail2Ban (Linux)

```bash
# Instalar
sudo apt-get install fail2ban

# Configurar para banir IPs com muitos 429
# /etc/fail2ban/jail.local
[connpet-ddos]
enabled = true
port = http,https
filter = connpet-ddos
logpath = /var/log/connpet/access.log
maxretry = 10
bantime = 3600  # 1 hora
findtime = 60   # em 1 minuto
```

---

## 🎯 Estratégia Completa de Defesa

### Camadas de Proteção

```
┌─────────────────────────────────────┐
│ 1. CloudFlare/CDN                   │ ← Primeira linha (DDoS L3/L4/L7)
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 2. Nginx/Load Balancer              │ ← Rate limiting + SSL
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 3. NestJS Throttler                 │ ← Rate limiting por rota
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 4. Brute Force Guard                │ ← Proteção de login
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 5. IP Blacklist                     │ ← Bloqueio de IPs
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ 6. Sua Aplicação                    │ ← Código seguro
└─────────────────────────────────────┘
```

---

## 📋 Checklist de Implementação

### Imediato
- [x] Instalar @nestjs/throttler
- [x] Criar SecurityModule
- [x] Criar CustomThrottlerGuard
- [x] Criar BruteForceGuard
- [x] Criar IP Blacklist Middleware
- [x] Configurar Helmet
- [x] Configurar CORS
- [x] Limitar payload
- [x] Criar Exception Filter

### Aplicar nos Controllers
- [ ] Adicionar @ThrottleStrict() em /auth/login
- [ ] Adicionar @ThrottleStrict() em /auth/register
- [ ] Adicionar @UseGuards(BruteForceGuard) em /auth/login
- [ ] Adicionar throttling apropriado em todos os endpoints

### Monitoramento
- [ ] Configurar logs de segurança
- [ ] Dashboard de métricas
- [ ] Alertas por email/Slack
- [ ] Integração com Grafana

### Produção
- [ ] Configurar CloudFlare
- [ ] Configurar Nginx
- [ ] Configurar Fail2Ban
- [ ] Redis para throttling distribuído
- [ ] Backup de IPs bloqueados

---

## 🚀 Ativação

```bash
# 1. Reiniciar servidor
cd connpet-server
npm run start:dev

# 2. Verificar no log:
✅ Rate Limiting ativo
✅ Brute Force Protection ativo
✅ Helmet ativo

# 3. Testar
curl http://localhost:5000/health
```

---

## 📚 Referências

- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [Helmet.js](https://helmetjs.github.io/)
- [OWASP - DDoS Prevention](https://owasp.org/www-community/attacks/Denial_of_Service)
- [Fastify Rate Limit](https://github.com/fastify/fastify-rate-limit)

---

**🛡️ Backend agora está protegido contra DDoS e ataques de força bruta!**

