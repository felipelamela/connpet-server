# 🚀 Guia de Implementação - Proteção DDoS

## ✅ Passos para Ativar a Proteção

### 1️⃣ Dependências já instaladas ✅

```bash
✅ @nestjs/throttler
✅ @fastify/helmet
✅ @fastify/rate-limit
```

### 2️⃣ Arquivos criados ✅

```
src/
├── security/
│   └── security.module.ts          ✅ Módulo principal de segurança
├── commom/
│   ├── guards/
│   │   ├── throttler.guard.ts      ✅ Rate limiting customizado
│   │   └── brute-force.guard.ts    ✅ Proteção força bruta
│   ├── middleware/
│   │   └── ip-blacklist.middleware.ts ✅ Blacklist de IPs
│   ├── decorators/
│   │   └── throttle.decorator.ts   ✅ Decorators de throttling
│   └── filters/
│       └── ddos-exception.filter.ts ✅ Tratamento de exceções
```

### 3️⃣ Configurações atualizadas ✅

- ✅ `app.module.ts` - SecurityModule importado
- ✅ `main.ts` - Helmet e CORS configurados

---

## 🔧 Próximos Passos (Você Precisa Fazer)

### Passo 1: Atualizar AuthController

Abra `src/auth/auth.controller.ts` e adicione:

```typescript
import { UseGuards } from '@nestjs/common';
import { ThrottleStrict } from '../commom/decorators/throttle.decorator';
import { BruteForceGuard } from '../commom/guards/brute-force.guard';

// Adicionar no constructor
constructor(
  private readonly authService: AuthService,
  private readonly bruteForceGuard: BruteForceGuard, // ADICIONAR
) {}

// Atualizar método login
@Post('login')
@Public()
@ThrottleStrict() // ADICIONAR
@UseGuards(BruteForceGuard) // ADICIONAR
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

// Adicionar método helper
private getClientIp(request: any): string {
  return (
    request.headers['x-forwarded-for']?.split(',')[0] ||
    request.headers['x-real-ip'] ||
    request.ip ||
    'unknown'
  );
}
```

### Passo 2: Registrar BruteForceGuard como Provider

No `auth.module.ts`:

```typescript
import { BruteForceGuard } from '../commom/guards/brute-force.guard';

@Module({
  imports: [...],
  controllers: [AuthController],
  providers: [
    AuthService,
    BruteForceGuard, // ADICIONAR
  ],
})
export class AuthModule {}
```

### Passo 3: Configurar .env

Adicione ao `.env`:

```env
# Origens permitidas (separadas por vírgula)
ALLOWED_ORIGINS=http://localhost:3000,http://192.168.1.7:3000,http://localhost:3001

# Já deve existir
JWT_SECRET=sua-chave-secreta
PORT=5000
```

### Passo 4: Aplicar Throttling em Outros Controllers

#### Exemplo - PetsController:

```typescript
import { ThrottleNormal, ThrottleRelaxed } from '../commom/decorators/throttle.decorator';

@Controller('pets')
export class PetsController {
  
  @Get() // Listar pets
  @ThrottleRelaxed() // 100 req/min
  async findAll() {
    return this.petsService.findAll();
  }

  @Post() // Criar pet
  @ThrottleNormal() // 30 req/min
  async create(@Body() createDto: CreatePetDto) {
    return this.petsService.create(createDto);
  }
}
```

#### Exemplo - PaymentsController:

```typescript
@Controller('payments')
export class PaymentsController {
  
  @Post() // Criar pagamento - Crítico!
  @ThrottleStrict() // 5 req/min
  async create(@Body() createDto: CreatePaymentDto) {
    return this.paymentsService.create(createDto);
  }
}
```

---

## ✅ Verificar se Está Funcionando

### 1. Iniciar servidor

```bash
cd connpet-server
npm run start:dev
```

### 2. Ver log de inicialização

Você deve ver:

```
╔════════════════════════════════════════════════════════════╗
║  🐾 ConnPet Server Iniciado com Sucesso!                  ║
╠════════════════════════════════════════════════════════════╣
║  🌐 Porta: 5000                                           ║
║  🛡️  Proteções Ativas:                                     ║
║     ✅ Rate Limiting (100 req/min)                        ║
║     ✅ Brute Force Protection (5 tentativas)              ║
║     ✅ Helmet Security Headers                            ║
║     ✅ CORS Configurado                                   ║
║     ✅ Body Limit (1MB)                                   ║
║     ✅ IP Tracking                                        ║
╚════════════════════════════════════════════════════════════╝
```

### 3. Testar proteção

```bash
# Teste 1: Exceder rate limit
for i in {1..110}; do
  curl http://localhost:5000/api/health &
done

# Deve bloquear após 100 requisições

# Teste 2: Login com senha errada 6 vezes
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"errada"}'
  sleep 1
done

# Deve bloquear após 5 tentativas
```

---

## 🎯 Resumo das Proteções

| Proteção | Limite | Bloqueio | Ação |
|----------|--------|----------|------|
| Rate Limit Geral | 100 req/min | 60s | Aguardar |
| Login (Throttle) | 5 req/min | 60s | Aguardar |
| Login (Brute Force) | 5 tentativas | 30min | Aguardar |
| Registro | 5 req/min | 60s | Aguardar |
| Recuperar Senha | 3 req/5min | 300s | Aguardar |
| Payload | 1MB | Imediato | Reduzir tamanho |
| IP Blacklist | 10 suspeitas | 15min | Bloquear IP |

---

## 🔥 Configurações Agressivas (Produção)

Se estiver sob ataque severo, ajuste para:

```typescript
// security.module.ts
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,
    limit: 5,    // ← Reduzir para 5
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 30,   // ← Reduzir para 30
  },
])

// brute-force.guard.ts
private readonly MAX_ATTEMPTS = 3;        // ← Reduzir para 3
private readonly BLOCK_DURATION = 3600000; // ← Aumentar para 1 hora
```

---

## 📊 Monitorar Ataques

### Ver logs em tempo real

```bash
# Linux
tail -f logs/connpet.log | grep "DDoS\|BLOQUEIO\|Rate limit"

# Ou com Grafana + Loki (já configurado)
# Acessar: http://localhost:3000 (Grafana)
```

### Endpoint de Estatísticas (Criar)

```typescript
// app.controller.ts
@Get('admin/security-stats')
@Roles('ADMIN')
async getSecurityStats() {
  return {
    bruteForce: this.bruteForceGuard.getStats(),
    timestamp: new Date().toISOString(),
    server: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  };
}
```

---

## 🚨 Em Caso de Ataque Real

### 1. Identificar o IP atacante

```bash
# Ver logs
tail -1000 logs/access.log | grep "429" | awk '{print $1}' | sort | uniq -c | sort -rn

# Exemplo de saída:
# 500 192.168.1.100  ← Este IP fez 500 requisições bloqueadas
#  50 192.168.1.101
```

### 2. Bloquear manualmente

```typescript
// Via código (criar endpoint admin)
@Post('admin/block-ip')
@Roles('ADMIN')
async blockIp(@Body('ip') ip: string) {
  this.ipBlacklistMiddleware.addToBlacklist(ip);
  return { message: `IP ${ip} bloqueado com sucesso` };
}
```

### 3. Bloquear via Firewall (Permanente)

```bash
# iptables (Linux)
sudo iptables -A INPUT -s 192.168.1.100 -j DROP

# firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address='192.168.1.100' reject"
sudo firewall-cmd --reload

# ufw (Ubuntu)
sudo ufw deny from 192.168.1.100
```

### 4. Ativar CloudFlare

- Proteção DDoS layer 3/4/7 automática
- Grátis para uso básico
- 1 clique para ativar "I'm Under Attack" mode

---

## 💡 Dicas de Segurança

### ✅ Boas Práticas

1. **Nunca desabilite** o rate limiting em produção
2. **Monitore logs** diariamente
3. **Atualize limites** baseado no tráfego real
4. **Use HTTPS** sempre
5. **Mantenha JWT_SECRET** seguro (mínimo 32 caracteres)
6. **Rotacione secrets** periodicamente
7. **Backup de blacklist** de IPs
8. **Documente incidentes** de segurança

### ⚠️ Evite

1. ❌ Limites muito baixos (bloqueará usuários legítimos)
2. ❌ Logar senhas ou tokens
3. ❌ Expor detalhes de erros em produção
4. ❌ CORS com `origin: '*'` em produção
5. ❌ Rodar como root
6. ❌ Portas abertas desnecessárias

---

## 🎯 Checklist de Ativação

- [ ] Dependências instaladas
- [ ] SecurityModule importado no AppModule
- [ ] Helmet configurado no main.ts
- [ ] CORS configurado com origens permitidas
- [ ] BruteForceGuard adicionado ao AuthController
- [ ] Throttling aplicado em endpoints sensíveis
- [ ] .env configurado com ALLOWED_ORIGINS
- [ ] Logs funcionando
- [ ] Testado com curl/Postman
- [ ] Monitoramento configurado

---

## 📚 Arquivo de Referência

Use como base: `src/auth/auth.controller.example.ts`

Copie o código de exemplo e adapte para seu `auth.controller.ts` existente.

---

**🛡️ Com isso, seu backend estará protegido contra:**
- ✅ DDoS (Distributed Denial of Service)
- ✅ Brute Force (Força bruta em login)
- ✅ Spam de requisições
- ✅ Payload bombs
- ✅ XSS/CSRF (via Helmet)
- ✅ IP maliciosos

**Segurança de nível profissional implementada! 🚀**

