# 💉 Modelo de Vacinação - Sistema ConnPet

**Data de Criação:** 16 de Outubro de 2025  
**Versão:** 1.0

---

## 📋 Visão Geral

Este documento descreve o modelo de dados criado para o sistema de vacinação veterinária, incluindo o catálogo de vacinas e o registro de aplicações.

---

## 🗂️ Modelos Criados

### 1. **VaccineType** (Tipo de Vacina - Catálogo)

Tabela que armazena os tipos de vacinas disponíveis, com informações sobre protocolo e aplicação.

#### Campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `name` | String(255) | Nome da vacina (ex: V10, Antirrábica, Tríplice Felina) |
| `description` | String (opcional) | Descrição detalhada da vacina |
| `species` | SpeciesEnum | Espécie do animal (DOG, CAT, BIRD, etc.) |
| `manufacturer` | String(255) (opcional) | Fabricante padrão da vacina |
| `dosesRequired` | Int | Número de doses necessárias (padrão: 1) |
| `intervalDays` | Int (opcional) | Intervalo entre doses em dias |
| `boosterIntervalMonths` | Int (opcional) | Intervalo para reforço em meses |
| `isRequired` | Boolean | Se é vacina obrigatória (padrão: false) |
| `ageApplicationMonths` | Int (opcional) | Idade mínima para aplicação em meses |
| `observations` | String (opcional) | Observações sobre a vacina |
| `active` | Boolean | Status ativo/inativo (padrão: true) |
| `clinicId` | UUID (opcional) | Clínica que cadastrou (null = vacina padrão do sistema) |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Data de atualização |

#### Relacionamentos:
- `clinic` → VeterinaryClinic (opcional)
- `vaccinations` → Vaccination[] (vacinações aplicadas)

#### Exemplos de Registros:

**Para Cães:**
- V10 (Múltipla canina) - 3 doses, intervalo de 21 dias, reforço anual
- Antirrábica - 1 dose, reforço anual, obrigatória
- Gripe Canina - 2 doses, intervalo de 21 dias
- Leishmaniose - 3 doses, intervalo de 21 dias

**Para Gatos:**
- Tríplice Felina (V3) - 2 doses, intervalo de 21 dias, reforço anual
- Quádrupla Felina (V4) - 2 doses, intervalo de 21 dias
- Antirrábica - 1 dose, reforço anual, obrigatória
- Leucemia Felina (FeLV) - 2 doses, intervalo de 21 dias

---

### 2. **Vaccination** (Vacinação Aplicada)

Tabela que registra cada aplicação de vacina realizada.

#### Campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `petId` | UUID | Pet que recebeu a vacina |
| `veterinarianProfileId` | UUID | Veterinário que aplicou |
| `vaccineTypeId` | UUID | Tipo de vacina aplicada |
| `clinicId` | UUID | Clínica onde foi aplicada |
| `applicationDate` | DateTime | Data e hora da aplicação |
| `batchNumber` | String(100) | Número do lote da vacina |
| `manufacturer` | String(255) | Fabricante da vacina |
| `expirationDate` | DateTime | Data de validade da vacina |
| `nextDoseDate` | DateTime (opcional) | Data prevista para próxima dose/reforço |
| `doseNumber` | Int | Número da dose (1ª, 2ª, 3ª, etc.) |
| `adverseReaction` | String (opcional) | Registro de reações adversas |
| `observations` | String (opcional) | Observações gerais |
| `createdAt` | DateTime | Data de criação do registro |
| `updatedAt` | DateTime | Data de atualização |

#### Relacionamentos:
- `pet` → Pet (animal vacinado)
- `veterinarianProfile` → VeterinarianProfile (veterinário responsável)
- `vaccineType` → VaccineType (tipo de vacina)
- `clinic` → VeterinaryClinic (clínica)

#### Índices:
- `petId` - Para buscar rapidamente todas as vacinas de um pet
- `clinicId` - Para buscar vacinas aplicadas em uma clínica
- `applicationDate` - Para ordenar por data

---

## 🔗 Relacionamentos Criados

### Atualizações nos Modelos Existentes:

#### Pet
```prisma
model Pet {
  // ... campos existentes
  vaccinations  Vaccination[]  // ✅ NOVO
}
```

#### VeterinarianProfile
```prisma
model VeterinarianProfile {
  // ... campos existentes
  vaccinations  Vaccination[]  // ✅ NOVO
}
```

#### VeterinaryClinic
```prisma
model VeterinaryClinic {
  // ... campos existentes
  vaccinations  Vaccination[]  // ✅ NOVO
  vaccineTypes  VaccineType[]  // ✅ NOVO
}
```

---

## 🎯 Enum Adicionado

### SpeciesEnum

Enum criado para padronizar as espécies de animais no sistema:

```prisma
enum SpeciesEnum {
  DOG          // Cão
  CAT          // Gato
  BIRD         // Ave
  RABBIT       // Coelho
  HAMSTER      // Hamster
  GUINEA_PIG   // Porquinho da Índia
  FERRET       // Furão
  REPTILE      // Réptil
  FISH         // Peixe
  OTHER        // Outro
}
```

---

## 📊 Fluxo de Uso

### 1. Cadastro de Tipos de Vacina (Admin/Clínica)
```
1. Cadastrar VaccineType com todas as informações
2. Definir protocolo (doses, intervalos, reforços)
3. Marcar se é obrigatória
```

### 2. Aplicação de Vacina
```
1. Selecionar o pet
2. Escolher o tipo de vacina (VaccineType)
3. Informar dados do lote e fabricante
4. Registrar a aplicação (Vaccination)
5. Sistema calcula automaticamente a próxima dose
```

### 3. Controle de Carteira de Vacinação
```
1. Buscar todas as vacinações do pet
2. Verificar vacinas pendentes
3. Alertar sobre próximas doses
4. Gerar carteira de vacinação digital
```

### 4. Lembretes Automáticos
```
1. Sistema verifica nextDoseDate
2. Envia notificação 7 dias antes
3. Envia lembrete no dia
4. Alerta vacinas vencidas
```

---

## 💡 Funcionalidades Possíveis

### ✅ Já Possível com o Modelo:
- [x] Cadastrar tipos de vacinas
- [x] Registrar aplicação de vacinas
- [x] Histórico completo de vacinação por pet
- [x] Rastreabilidade (lote, fabricante, validade)
- [x] Controle de doses (1ª, 2ª, 3ª)
- [x] Previsão de próxima dose
- [x] Registro de reações adversas
- [x] Protocolo por espécie
- [x] Vacinas obrigatórias x opcionais
- [x] Carteira de vacinação digital

### 🔜 Próximas Implementações (Backend):
- [ ] Cálculo automático de nextDoseDate
- [ ] Validação de idade mínima
- [ ] Alerta de vacinas vencidas/pendentes
- [ ] Relatório de cobertura vacinal
- [ ] Exportação de carteira (PDF)
- [ ] Integração com notificações

---

## 🔐 Regras de Negócio Sugeridas

### Validações:
1. **Idade mínima**: Verificar se o pet tem idade mínima para receber a vacina
2. **Intervalo entre doses**: Validar se o intervalo mínimo foi respeitado
3. **Validade**: Não permitir aplicar vacina vencida
4. **Espécie**: Verificar se a vacina é adequada para a espécie do pet
5. **Dose número**: Não permitir dose 3 sem ter doses 1 e 2

### Cálculo de Próxima Dose:
```typescript
// Exemplo de lógica
if (doseNumber < vaccineType.dosesRequired) {
  nextDoseDate = applicationDate + vaccineType.intervalDays
} else {
  // Última dose - calcular reforço
  nextDoseDate = applicationDate + (vaccineType.boosterIntervalMonths * 30)
}
```

---

## 📈 Queries Úteis

### Buscar vacinas de um pet:
```sql
SELECT * FROM Vaccination 
WHERE petId = '...'
ORDER BY applicationDate DESC
```

### Buscar vacinas pendentes:
```sql
SELECT * FROM Vaccination 
WHERE nextDoseDate IS NOT NULL 
AND nextDoseDate <= CURRENT_DATE + INTERVAL '7 days'
AND nextDoseDate >= CURRENT_DATE
```

### Buscar pets sem vacinação obrigatória:
```sql
SELECT p.* FROM Pet p
WHERE NOT EXISTS (
  SELECT 1 FROM Vaccination v
  JOIN VaccineType vt ON v.vaccineTypeId = vt.id
  WHERE v.petId = p.id AND vt.isRequired = true
)
```

---

## 📋 Próximos Passos

### 1. Executar Migration
```bash
npx prisma migrate dev --name add_vaccination_models
```

### 2. Gerar Prisma Client
```bash
npx prisma generate
```

### 3. Implementar Backend
- [ ] Criar módulo Vaccination
- [ ] Criar módulo VaccineType
- [ ] DTOs, Services, Controllers, Repository, Handlers
- [ ] Validações de negócio
- [ ] Endpoints REST

### 4. Funcionalidades Adicionais
- [ ] Sistema de notificações
- [ ] Cálculo automático de próximas doses
- [ ] Relatórios
- [ ] Dashboard de cobertura vacinal
- [ ] Exportação de carteira digital

---

## 🎨 Exemplos de Dados

### Exemplo de VaccineType:
```json
{
  "name": "V10 - Múltipla Canina",
  "description": "Protege contra 10 doenças: cinomose, parvovirose, hepatite, etc.",
  "species": "DOG",
  "manufacturer": "Zoetis",
  "dosesRequired": 3,
  "intervalDays": 21,
  "boosterIntervalMonths": 12,
  "isRequired": true,
  "ageApplicationMonths": 2,
  "active": true
}
```

### Exemplo de Vaccination:
```json
{
  "petId": "uuid-do-pet",
  "veterinarianProfileId": "uuid-do-vet",
  "vaccineTypeId": "uuid-do-tipo-vacina",
  "clinicId": "uuid-da-clinica",
  "applicationDate": "2025-10-16T10:30:00Z",
  "batchNumber": "LOT123456",
  "manufacturer": "Zoetis",
  "expirationDate": "2026-10-16",
  "nextDoseDate": "2025-11-06",
  "doseNumber": 1,
  "adverseReaction": null,
  "observations": "Pet reagiu bem à aplicação"
}
```

---

## 📚 Referências

Baseado em:
- Cartões de vacinação veterinária padrão
- Protocolos de vacinação canina e felina
- Melhores práticas de sistemas veterinários
- Requisitos legais de rastreabilidade

---

**Status:** ✅ Modelo Criado no Prisma Schema  
**Próximo Passo:** Executar migration e implementar backend

---

*Documento gerado automaticamente baseado em pesquisa de mercado e melhores práticas veterinárias.*

