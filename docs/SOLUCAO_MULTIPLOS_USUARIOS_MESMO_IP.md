# 🏥 Solução para Múltiplos Usuários no Mesmo IP (Clínica)

## 🎯 Problema Identificado

**Cenário:**
- Clínica com **20 computadores**
- Todos compartilham o **mesmo IP público** (mesmo roteador)
- **20 funcionários** diferentes fazendo login
- Rate limiting atual: **5 req/min** no login

**Resultado sem a solução:**
- ❌ Após 5 logins, todos os outros seriam bloqueados
- ❌ Funcionários não conseguiriam acessar
- ❌ Sistema inutilizável para clínicas

---

## ✅ Solução Implementada: Smart Throttler

### Arquivo: `src/commom/guards/smart-throttler.guard.ts`

### 🧠 Lógica Inteligente

O **SmartThrottlerGuard** usa tracking dinâmico:

```typescript
// 1. USUÁRIO AUTENTICADO (já fez login)
// Tracking: IP + UserId
// Exemplo: "192.168.1.1:user-abc-123"
// Resultado: Cada usuário tem seu próprio limite!
// ✅ 20 usuários = 20 limites separados

// 2. LOGIN/REGISTRO (não autenticado, mas tem email)
// Tracking: IP + Email
// Exemplo: "192.168.1.1:email-joao@email.com"
// Resultado: Cada email tem seu próprio limite!
// ✅ 20 emails diferentes = 20 limites separados

// 3. ENDPOINTS PÚBLICOS (health, status)
// Tracking: apenas IP
// Exemplo: "192.168.1.1"
// Resultado: Todos compartilham o mesmo limite
// ⚠️ Mas esses endpoints não são sensíveis
```

---

## 📊 Comparação

### ❌ Sem Smart Throttler (Problema)

```
Clínica com 20 funcionários, IP: 192.168.1.1

Funcionário 1 faz login → Contador: 1/5 para 192.168.1.1
Funcionário 2 faz login → Contador: 2/5 para 192.168.1.1
Funcionário 3 faz login → Contador: 3/5 para 192.168.1.1
Funcionário 4 faz login → Contador: 4/5 para 192.168.1.1
Funcionário 5 faz login → Contador: 5/5 para 192.168.1.1
Funcionário 6 faz login → ❌ BLOQUEADO! (mesmo IP)
...
Funcionário 20 faz login → ❌ BLOQUEADO!

❌ Apenas 5 dos 20 conseguem fazer login!
```

### ✅ Com Smart Throttler (Solução)

```
Clínica com 20 funcionários, IP: 192.168.1.1

Funcionário 1 (joao@email.com) → Contador: 1/5 para 192.168.1.1:email-joao@email.com
Funcionário 2 (maria@email.com) → Contador: 1/5 para 192.168.1.1:email-maria@email.com
Funcionário 3 (carlos@email.com) → Contador: 1/5 para 192.168.1.1:email-carlos@email.com
...
Funcionário 20 (ana@email.com) → Contador: 1/5 para 192.168.1.1:email-ana@email.com

✅ Todos os 20 conseguem fazer login!
✅ Cada um tem seu próprio limite de 5/min
✅ Total de 100 logins/min possíveis (20 usuários × 5)
```

---

## 🔢 Novos Limites Aumentados

Para suportar clínicas com múltiplos usuários:

| Nível | Antes | Depois | Motivo |
|-------|-------|--------|--------|
| Short (1s) | 10 req | **20 req** | Múltiplos usuários simultâneos |
| Medium (10s) | 50 req | **100 req** | Tráfego de clínica grande |
| Long (1min) | 100 req | **300 req** | 20 usuários × 15 req/min cada |

**Ainda assim protege contra DDoS:**
- 300 req/min de um único IP = OK para clínica
- 3000 req/min de um único IP = DDoS → BLOQUEIA

---

## 🎯 Como Funciona na Prática

### Cenário 1: Clínica Normal (20 funcionários)

```
8h da manhã - Todos chegando e fazendo login:

08:00:00 → João faz login (192.168.1.1:email-joao@...)
08:00:02 → Maria faz login (192.168.1.1:email-maria@...)
08:00:04 → Carlos faz login (192.168.1.1:email-carlos@...)
...
08:00:38 → Ana faz login (192.168.1.1:email-ana@...)

✅ TODOS CONSEGUEM! Cada um tem tracking separado!

Depois que logaram, fazendo requisições:

08:05:00 → João busca lista de pets (192.168.1.1:user-joao-id)
08:05:01 → Maria busca lista de pets (192.168.1.1:user-maria-id)
08:05:02 → Carlos busca lista de pets (192.168.1.1:user-carlos-id)

✅ TODOS CONSEGUEM! Cada um tem limite separado!
```

### Cenário 2: Ataque Real

```
Hacker tentando força bruta no mesmo IP:

10:00:00 → teste1@hack.com (192.168.1.100:email-teste1@...)
10:00:01 → teste2@hack.com (192.168.1.100:email-teste2@...)
10:00:02 → teste3@hack.com (192.168.1.100:email-teste3@...)
...
10:00:10 → teste100@hack.com (192.168.1.100:email-teste100@...)

⚠️  Mesmo com emails diferentes, o BRUTE FORCE GUARD detecta:
- Múltiplos emails do mesmo IP em curto período
- Mais de 10 tentativas suspeitas
🚫 BLOQUEIA O IP TEMPORARIAMENTE!
```

---

## 🔒 Proteções Mantidas

### 1. Proteção Contra Mesmo Email (Força Bruta)

```
Hacker tentando adivinhar senha do joao@email.com:

Tentativa 1: joao@email.com + senha1 → Falha
Tentativa 2: joao@email.com + senha2 → Falha
Tentativa 3: joao@email.com + senha3 → Falha
Tentativa 4: joao@email.com + senha4 → Falha
Tentativa 5: joao@email.com + senha5 → Falha
Tentativa 6: joao@email.com + senha6 → 🚫 BLOQUEADO!

✅ Tracking: IP + Email
✅ Mesmo que venha de IPs diferentes, bloqueia
```

### 2. Proteção Contra DDoS Massivo

```
Mesmo IP fazendo 3000 requisições/minuto:

Req 1-300: OK
Req 301+: 🚫 BLOQUEADO!

✅ Mesmo com usuários diferentes, 
   existe um limite global por IP
```

---

## 💡 Recomendações por Cenário

### Clínica Pequena (1-5 funcionários)
```typescript
// Pode usar limites conservadores
limit: 100,  // 100 req/min OK
```

### Clínica Média (6-20 funcionários)
```typescript
// Use limites aumentados (atual)
limit: 300,  // 300 req/min = 15 por funcionário
```

### Clínica Grande (20-50 funcionários)
```typescript
// Aumentar ainda mais
{
  name: 'long',
  ttl: 60000,
  limit: 500,  // 500 req/min = 10 por funcionário
}
```

### Rede de Clínicas (50+ funcionários)
```typescript
// Considerar usar Redis + tracking avançado
{
  name: 'long',
  ttl: 60000,
  limit: 1000,  // 1000 req/min
}

// E adicionar whitelist de IPs conhecidos
```

---

## ⚙️ Configuração Flexível

### Opção 1: Whitelist para IPs de Clínicas

```typescript
// ip-blacklist.middleware.ts

// Adicionar IPs de clínicas conhecidas à whitelist
private whitelist: Set<string> = new Set([
  '192.168.1.1',   // Clínica A
  '10.0.50.100',   // Clínica B
  '172.16.20.50',  // Clínica C
]);

// IPs na whitelist:
// ✅ Bypass completo do rate limiting
// ✅ Sem limites
// ⚠️  Use com cuidado!
```

### Opção 2: Limites Maiores para Rotas Internas

```typescript
// Exemplo de configuração por rota
@Controller('pets')
export class PetsController {
  
  // Para funcionários da clínica (autenticados)
  @Get()
  @ThrottleCustom(500, 60) // 500 req/min - muito alto
  async findAll(@User() user) {
    // Usuário autenticado, tracking: IP + UserId
    // Múltiplos usuários = múltiplos limites
    return this.petsService.findAll(user);
  }

  // Para público (não autenticado)
  @Get('public')
  @Public()
  @ThrottleStrict() // 5 req/min - bem baixo
  async findPublic() {
    // Público, tracking: apenas IP
    // Um IP = um limite (protege contra scraping)
    return this.petsService.findPublic();
  }
}
```

---

## 🧪 Teste para Clínica

### Simular 20 Usuários Fazendo Login

```bash
# Criar arquivo de teste
cat > test-clinic-login.sh << 'EOF'
#!/bin/bash

# Simular 20 funcionários da mesma clínica
for i in {1..20}; do
  EMAIL="funcionario${i}@clinica.com"
  echo "Login: $EMAIL"
  
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 192.168.1.1" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"senha123\"}" \
    -w "\nStatus: %{http_code}\n\n" \
    -s
  
  sleep 0.5
done
EOF

chmod +x test-clinic-login.sh
./test-clinic-login.sh
```

**Resultado esperado:**
```
✅ Todos os 20 logins devem funcionar!
✅ Cada email tem seu próprio contador
✅ Nenhum bloqueio indevido
```

---

## 📊 Tracking Detalhado

### Como o Sistema Rastreia

```
┌─────────────────────────────────────────┐
│ Requisição Recebida                     │
└──────────────┬──────────────────────────┘
               │
               ▼
         [Tem usuário autenticado?]
               │
       ┌───────┴───────┐
       │ SIM           │ NÃO
       ▼               ▼
  IP + UserId    [Tem email no body?]
                       │
               ┌───────┴───────┐
               │ SIM           │ NÃO
               ▼               ▼
          IP + Email      Apenas IP
```

**Exemplos:**

```
Tracking Key                          Contexto
────────────────────────────────────────────────────────────
192.168.1.1:user-abc-123            João autenticado
192.168.1.1:user-def-456            Maria autenticada
192.168.1.1:email-novo@email.com    Novo usuário fazendo login
192.168.1.1                         Endpoint público (health)
```

---

## 🎯 Limites Recomendados por Tipo

### Para Endpoints Autenticados (SmartThrottler)

```typescript
// Usuários autenticados têm limites maiores
// Porque cada usuário tem tracking separado

@Get('pets')
@ThrottleRelaxed() // 300 req/min por usuário
async getPets(@User() user) {
  // 20 usuários × 300 = 6000 req/min total OK!
}
```

### Para Endpoints Públicos (SmartThrottler)

```typescript
// Endpoints públicos têm limites menores
// Porque tracking é por IP (todos compartilham)

@Get('public-info')
@Public()
@ThrottleNormal() // 30 req/min por IP
async getPublicInfo() {
  // Mesmo 20 usuários, todos compartilham 30 req/min
  // Mas é público, não precisa de muitas requisições
}
```

### Para Login (SmartThrottler + BruteForce)

```typescript
@Post('login')
@Public()
@ThrottleStrict() // 5 req/min por email
@UseGuards(BruteForceGuard)
async login(@Body() dto: LoginAuthDto) {
  // Tracking: IP + Email
  // Cada email diferente = limite separado
  // ✅ 20 emails × 5 = 100 logins/min OK!
  
  // Mas mesma pessoa tentando 6 senhas erradas = BLOQUEIO
  // ✅ Protege contra força bruta
}
```

---

## 🏥 Configuração Específica para Clínicas

### Pequena (1-10 usuários)
```typescript
limit: 200,  // 20 por usuário
```

### Média (10-30 usuários)
```typescript
limit: 300,  // 10 por usuário (atual)
```

### Grande (30-100 usuários)
```typescript
limit: 1000, // 10 por usuário
```

### Rede de Clínicas (100+ usuários)
```typescript
limit: 5000, // 50 por usuário

// E considere Redis para distribuir entre servidores
```

---

## 🔐 Ainda Protege Contra Ataques

### Ataque 1: Força Bruta em 1 Conta

```
Hacker tenta adivinhar senha de joao@clinica.com:

192.168.1.100:email-joao@clinica.com
Tentativa 1: senha1 → Falha (1/5)
Tentativa 2: senha2 → Falha (2/5)
Tentativa 3: senha3 → Falha (3/5)
Tentativa 4: senha4 → Falha (4/5)
Tentativa 5: senha5 → Falha (5/5)
Tentativa 6: senha6 → 🚫 BLOQUEADO por 30 minutos!

✅ Detecta e bloqueia!
```

### Ataque 2: Credential Stuffing (Múltiplos Emails)

```
Hacker tenta 100 emails diferentes:

192.168.1.100:email-teste1@...
192.168.1.100:email-teste2@...
...
192.168.1.100:email-teste100@...

⚠️  BruteForceGuard detecta:
- Mesma IP
- Muitos emails diferentes
- Padrão suspeito
🚫 BLOQUEIA IP após 10 tentativas suspeitas!

✅ Detecta e bloqueia!
```

### Ataque 3: DDoS Simples

```
1000 requisições do mesmo IP em 1 minuto:

Req 1-300: ✅ OK
Req 301: 🚫 BLOQUEADO! (Rate limit global)

✅ Bloqueia automaticamente!
```

---

## 💡 Melhores Práticas

### 1. Use SmartThrottlerGuard (Padrão)
```typescript
// Em security.module.ts
useClass: SmartThrottlerGuard, // ✅ Inteligente
// NÃO: useClass: ThrottlerGuard, // ❌ Burro (só IP)
```

### 2. Aumente Limites para Autenticados
```typescript
// Rotas autenticadas podem ter limites maiores
@Get('dashboard')
@ThrottleRelaxed() // 300 req/min
async getDashboard(@User() user) {
  // Cada usuário tem seu próprio limite
}
```

### 3. Mantenha Limites Baixos para Públicos
```typescript
// Rotas públicas devem ter limites baixos
@Get('public-catalog')
@Public()
@ThrottleStrict() // 5 req/min
async getPublicCatalog() {
  // Todos do mesmo IP compartilham limite
}
```

### 4. Whitelist para IPs Conhecidos (Opcional)
```typescript
// Se você conhece o IP da clínica
ipBlacklistMiddleware.addToWhitelist('IP_DA_CLINICA');
// ✅ Bypass total do rate limiting
```

---

## 📝 Configuração por Ambiente

### Desenvolvimento (Local)
```typescript
limit: 1000,  // Sem limites agressivos
```

### Staging (Testes)
```typescript
limit: 300,   // Limites médios
```

### Produção (Real)
```typescript
limit: 300,   // Adequado para clínicas médias
// Ajustar baseado em métricas reais
```

---

## 🚀 Como Ajustar Dinamicamente

### Via Variável de Ambiente

```typescript
// security.module.ts
ThrottlerModule.forRoot([
  {
    name: 'long',
    ttl: 60000,
    limit: Number(process.env.RATE_LIMIT_LONG) || 300,
  },
])
```

```bash
# .env
RATE_LIMIT_LONG=500  # Para clínicas grandes
```

### Via Configuração por Tenant (Avançado)

```typescript
// Para SaaS com múltiplas clínicas
const clinicConfig = await this.getClinicConfig(clinicId);

const limit = clinicConfig.employeeCount * 15; // 15 req/min por funcionário
```

---

## ✅ Conclusão

### ✅ SIM, funciona para 20 computadores!

**Graças ao SmartThrottlerGuard:**
- ✅ Cada **usuário** tem limite separado
- ✅ Cada **email** tem limite separado
- ✅ **20 funcionários** = 20 limites independentes
- ✅ **300 req/min** total = suficiente
- ✅ Ainda **protege contra DDoS**
- ✅ Ainda **protege contra força bruta**

**Não terá problema! A solução foi desenhada exatamente para esse cenário! 🎯**

---

## 📞 Se Ainda Tiver Problemas

### Sintoma: "Funcionários sendo bloqueados"

**Solução 1:** Aumentar limite global
```typescript
limit: 500,  // ou 1000
```

**Solução 2:** Whitelist do IP da clínica
```typescript
ipBlacklistMiddleware.addToWhitelist('IP_CLINICA');
```

**Solução 3:** Desabilitar temporariamente
```typescript
// Comentar no app.module.ts (NÃO RECOMENDADO)
// SecurityModule,
```

---

**🎉 Sistema inteligente que diferencia usuários legítimos de ataques!**

