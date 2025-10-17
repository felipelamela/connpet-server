# 🛡️ Padrões de Erro - Proteção DDoS

## ✅ Atualizado para usar ErrorResponse do Projeto!

---

## 📋 Novos Códigos de Erro Adicionados

### Arquivo: `src/commom/enum/error.enum.ts`

```typescript
export enum ErrorEnum {
  // ... erros existentes ...
  TOO_MANY_REQUESTS = 'E-0006',      // Geral
  RATE_LIMIT_EXCEEDED = 'E-0007',    // Rate limiting excedido
  IP_BLOCKED = 'E-0008',             // IP bloqueado permanentemente
  BRUTE_FORCE_DETECTED = 'E-0009',   // Força bruta detectada
  ACCOUNT_LOCKED = 'E-0010',         // Conta bloqueada temporariamente
}
```

---

## 🎯 Como os Erros São Lançados

### 1. **Rate Limit Excedido**

```typescript
// throttler.guard.ts
throw new ErrorResponse({
  message: 'Muitas requisições. Por favor, aguarde alguns segundos e tente novamente.',
  statusCode: 429,
  errorsCode: ErrorEnum.RATE_LIMIT_EXCEEDED,
  details: {
    ip: '192.168.***', // IP parcialmente oculto
    timestamp: new Date().toISOString(),
  },
});
```

**Resposta ao Cliente:**
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Muitas requisições. Por favor, aguarde alguns segundos e tente novamente.",
  "errorsCode": "E-0007",
  "details": {
    "ip": "192.168.***",
    "timestamp": "2025-10-17T22:45:00.000Z"
  }
}
```

---

### 2. **Conta Bloqueada (Brute Force)**

```typescript
// brute-force.guard.ts
throw new ErrorResponse({
  message: `Conta temporariamente bloqueada por múltiplas tentativas de login. Tente novamente em ${remainingMinutes} minutos.`,
  statusCode: 429,
  errorsCode: ErrorEnum.ACCOUNT_LOCKED,
  details: {
    email: 'user@email.com',
    blockedUntil: '2025-10-17T23:15:00.000Z',
    remainingMinutes: 25,
  },
});
```

**Resposta ao Cliente:**
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Conta temporariamente bloqueada por múltiplas tentativas de login. Tente novamente em 25 minutos.",
  "errorsCode": "E-0010",
  "details": {
    "email": "user@email.com",
    "blockedUntil": "2025-10-17T23:15:00.000Z",
    "remainingMinutes": 25
  }
}
```

---

### 3. **IP Bloqueado Permanentemente**

```typescript
// ip-blacklist.middleware.ts
throw new ErrorResponse({
  message: 'Acesso negado. IP bloqueado por atividade suspeita.',
  statusCode: 403,
  errorsCode: ErrorEnum.IP_BLOCKED,
  details: {
    ip: '192.168.***',
    timestamp: new Date().toISOString(),
  },
});
```

**Resposta ao Cliente:**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Acesso negado. IP bloqueado por atividade suspeita.",
  "errorsCode": "E-0008",
  "details": {
    "ip": "192.168.***",
    "timestamp": "2025-10-17T22:45:00.000Z"
  }
}
```

---

### 4. **Muitas Tentativas Suspeitas**

```typescript
// ip-blacklist.middleware.ts
throw new ErrorResponse({
  message: `Muitas tentativas suspeitas. Tente novamente em ${remainingTime} minutos.`,
  statusCode: 429,
  errorsCode: ErrorEnum.TOO_MANY_REQUESTS,
  details: {
    ip: '192.168.***',
    remainingMinutes: 15,
    timestamp: new Date().toISOString(),
  },
});
```

---

## 📝 Arquivos Atualizados

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `error.enum.ts` | +4 novos códigos | ✅ |
| `throttler.guard.ts` | Usa ErrorResponse | ✅ |
| `brute-force.guard.ts` | Usa ErrorResponse | ✅ |
| `ip-blacklist.middleware.ts` | Usa ErrorResponse | ✅ |
| `ddos-exception.filter.ts` | Usa ErrorResponse | ✅ |
| `auth.controller.example.ts` | Usa ErrorResponse | ✅ |

---

## 🎨 Formato de Resposta Padronizado

### Sucesso
```json
{
  "success": true,
  "statusCode": 200,
  "data": { ... }
}
```

### Erro de Segurança
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Mensagem amigável",
  "errorsCode": "E-0007",
  "details": {
    "ip": "192.168.***",
    "timestamp": "2025-10-17T22:45:00.000Z",
    "remainingMinutes": 15
  }
}
```

---

## 🚀 Exemplo de Uso no Frontend

### React Native (ConnPet App)

```typescript
// No serviço de API
try {
  await api.post('/auth/login', { email, password });
} catch (error) {
  if (error.response?.data?.errorsCode === 'E-0010') {
    // Conta bloqueada
    Alert.alert(
      'Conta Bloqueada',
      error.response.data.message,
      [{ text: 'OK' }]
    );
  } else if (error.response?.data?.errorsCode === 'E-0007') {
    // Rate limit
    Alert.alert(
      'Aguarde um Momento',
      error.response.data.message,
      [{ text: 'OK' }]
    );
  } else {
    // Outros erros
    Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
  }
}
```

### Next.js (ConnPet Admin)

```typescript
// No try/catch de requisições
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    switch (data.errorsCode) {
      case 'E-0010': // Conta bloqueada
        toast.error(data.message);
        break;
      case 'E-0007': // Rate limit
        toast.warning(data.message);
        break;
      case 'E-0008': // IP bloqueado
        toast.error('Acesso negado. Entre em contato com o suporte.');
        break;
      default:
        toast.error(data.message);
    }
  }
} catch (error) {
  toast.error('Erro de conexão');
}
```

---

## 📊 Mapeamento de Códigos de Erro

| Código | Nome | Status | Descrição |
|--------|------|--------|-----------|
| E-0006 | TOO_MANY_REQUESTS | 429 | Muitas requisições gerais |
| E-0007 | RATE_LIMIT_EXCEEDED | 429 | Rate limiting excedido |
| E-0008 | IP_BLOCKED | 403 | IP bloqueado permanentemente |
| E-0009 | BRUTE_FORCE_DETECTED | 429 | Ataque de força bruta |
| E-0010 | ACCOUNT_LOCKED | 429 | Conta bloqueada temporariamente |

---

## 🔐 Headers de Resposta DDoS

Quando rate limit é excedido, o backend retorna headers adicionais:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1729200660000
Content-Type: application/json

{
  "success": false,
  "statusCode": 429,
  "message": "Muitas requisições...",
  "errorsCode": "E-0007",
  "details": { ... }
}
```

O cliente pode usar esses headers para:
- `Retry-After`: Quanto tempo aguardar
- `X-RateLimit-Remaining`: Quantas requisições restam
- `X-RateLimit-Reset`: Timestamp do reset

---

## 🧪 Testar Respostas de Erro

### Teste 1: Exceder Rate Limit

```bash
# Fazer 110 requisições
seq 110 | xargs -I {} -P 110 curl -s http://localhost:5000/api/health

# Deve retornar após 100:
{
  "success": false,
  "statusCode": 429,
  "message": "Muitas requisições...",
  "errorsCode": "E-0007",
  "details": {
    "ip": "192.168.***",
    "timestamp": "..."
  }
}
```

### Teste 2: Brute Force

```bash
# 6 tentativas de login errado
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"errada"}'
  sleep 1
done

# Deve retornar na 6ª:
{
  "success": false,
  "statusCode": 429,
  "message": "Conta temporariamente bloqueada...",
  "errorsCode": "E-0010",
  "details": {
    "email": "test@test.com",
    "blockedUntil": "2025-10-17T23:15:00.000Z",
    "remainingMinutes": 30
  }
}
```

---

## 💡 Vantagens do Padrão ErrorResponse

✅ **Consistência**: Todos os erros têm o mesmo formato
✅ **Rastreabilidade**: `errorsCode` único para cada tipo
✅ **Detalhes**: Campo `details` para informações adicionais
✅ **Frontend**: Fácil de tratar no cliente (switch/case)
✅ **Logs**: Estruturado e fácil de filtrar
✅ **Documentação**: Códigos auto-documentados

---

## 🎯 Checklist de Implementação

- [x] Adicionar códigos de erro ao ErrorEnum
- [x] Atualizar CustomThrottlerGuard
- [x] Atualizar BruteForceGuard
- [x] Atualizar IpBlacklistMiddleware
- [x] Atualizar DDoSExceptionFilter
- [x] Atualizar exemplo do AuthController
- [ ] Aplicar no AuthController real
- [ ] Testar respostas de erro
- [ ] Documentar códigos para frontend

---

## 📚 Referência Rápida

```typescript
// Sempre use:
throw new ErrorResponse({
  message: 'Mensagem amigável',
  statusCode: 429,
  errorsCode: ErrorEnum.RATE_LIMIT_EXCEEDED,
  details: { /* informações adicionais */ }
});

// NUNCA use:
throw new HttpException(...);      // ❌
throw new Error('...');            // ❌
throw new ThrottlerException(...); // ❌
```

---

**✅ Todos os arquivos de segurança agora seguem o padrão ErrorResponse!**

