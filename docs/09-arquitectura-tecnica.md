# 09 — Arquitectura técnica

## 9.1 Decisão de arquitectura

Toda a aplicação — interface, backend e API — é construída num **único projecto Next.js full-stack** (App Router), em TypeScript, neste repositório.

| Decisão | Motivo |
| --- | --- |
| Um só projecto e uma só linguagem | Equipa pequena, tipos partilhados de ponta a ponta, um único deploy |
| Monólito modular | Fronteiras claras entre módulos de RH, sem o custo operacional de microsserviços |
| Next.js alojado em servidor Node próprio (`output: "standalone"` em Docker) | Controlo sobre a residência dos dados (Lei n.º 22/11), processos de longa duração e custos previsíveis |
| Aplicação móvel nativa **fora do âmbito nesta fase** | O portal do trabalhador é uma aplicação web responsiva, usada no navegador do telemóvel |

## 9.2 Visão geral

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Navegador (computador, tablet, telemóvel)        Sistemas de clientes    │
└──────────────┬──────────────────────────────────────────┬───────────────┘
               │ HTTPS                                    │ HTTPS (OAuth 2.0)
┌──────────────▼──────────────────────────────────────────▼───────────────┐
│ Next.js (processo web)                                                   │
│                                                                          │
│  middleware.ts ── sessão, redirecção, cabeçalhos de segurança            │
│                                                                          │
│  Server Components ──┐   Server Actions ──┐   Route Handlers (app/api) ──┐│
│  (leitura de dados)  │   (mutações da UI) │   API pública v1, webhooks,  ││
│                      │                    │   ficheiros, SSE, cron       ││
│                      ▼                    ▼                              ▼│
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ server/ — camada de domínio (só corre no servidor)                  │ │
│  │  auth · rbac · audit · tenant                                       │ │
│  │  modules: organization · employees · contracts · attendance · leave │ │
│  │           payroll · payments · tax-filings · performance · ...      │ │
│  │  payroll-engine (puro) · integrations (bancos, AGT, INSS, SMS)       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────┬───────────────────────────────┬──────────────────────────┘
               │                               │ enfileira tarefas
┌──────────────▼───────────┐     ┌─────────────▼────────────────────────────┐
│ PostgreSQL               │◄────│ Worker (mesmo repositório, mesmo código   │
│ dados · RLS por tenant   │     │ server/) — cálculo da folha em massa,     │
│ fila de tarefas (pg-boss)│     │ PDF dos recibos, e-mails/SMS, ficheiros   │
└──────────────────────────┘     │ bancários, tarefas agendadas              │
                                 └─────────────┬────────────────────────────┘
                                               ▼
                                 Armazenamento de objectos (S3 compatível)
                                 documentos, recibos PDF, ficheiros gerados
```

**Porque existe um worker:** um pedido HTTP não deve ficar à espera do cálculo de 1 000 recibos nem da geração de 1 000 PDF. Essas tarefas correm num processo Node separado (`pnpm worker`), que faz parte deste projecto e reutiliza exactamente os mesmos módulos de `server/`. Não é outro backend: é o mesmo código num segundo processo.

## 9.3 Stack

| Área | Tecnologia |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript (modo `strict`) |
| Estilos e componentes | Tailwind CSS 3, shadcn/ui sobre Radix UI, Lucide |
| Formulários e validação | React Hook Form + Zod (os mesmos esquemas validam no cliente e no servidor) |
| Gráficos | Recharts |
| Datas | date-fns (locale `pt`, fuso `Africa/Luanda`) |
| Notificações na interface | Sonner |
| Tema | next-themes (claro/escuro) |
| Base de dados | PostgreSQL 16+ |
| ORM e migrações | Prisma (`Decimal` para valores monetários) |
| Autenticação | Auth.js (NextAuth v5): credenciais, OTP por SMS, 2FA (TOTP), SSO via OIDC/SAML no plano Empresarial |
| Fila e tarefas agendadas | pg-boss (fila sobre o próprio PostgreSQL, sem Redis) |
| Tempo real | Server-Sent Events (SSE) em Route Handlers |
| PDF | `@react-pdf/renderer` (recibos e documentos como componentes React) |
| Excel | ExcelJS (importação e exportação) |
| E-mail | Modelos em React Email, envio por SMTP ou fornecedor transaccional |
| Armazenamento | Cliente S3 compatível (MinIO em desenvolvimento) |
| Testes | Vitest (unitários e motor de cálculo), Playwright (end-to-end) |
| Gestor de pacotes | pnpm |

## 9.4 Estrutura de pastas

```
app/
├── (public)/
│   ├── login/
│   ├── register/
│   └── careers/[company]/
├── (private)/                    # área autenticada (layout com sidebar)
│   ├── page.tsx                  # dashboard
│   ├── employees/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── actions.ts            # Server Actions do ecrã (finas: validam e chamam server/)
│   ├── payroll/
│   ├── attendance/ ...
│   └── settings/
├── (portal)/                     # portal do trabalhador (web responsiva)
└── api/
    ├── v1/                       # API pública (OAuth 2.0 + âmbitos)
    │   ├── employees/route.ts
    │   ├── payroll/...
    │   └── openapi.json/route.ts
    ├── auth/[...nextauth]/route.ts
    ├── events/route.ts           # SSE: notificações, mensagens, progresso do cálculo
    ├── files/[id]/route.ts       # descarga autorizada de documentos e recibos
    ├── webhooks/                 # entradas de terceiros (ex.: biométricos)
    └── cron/[job]/route.ts       # disparo opcional de tarefas por agendador externo

server/                           # NUNCA importado por componentes cliente ("server-only")
├── db/
│   ├── client.ts                 # Prisma
│   └── tenant.ts                 # define app.tenant_id na transacção (RLS)
├── auth/                         # sessão, 2FA, OTP
├── rbac/                         # authorize(ctx, "payroll.approve")
├── audit/                        # registo de auditoria
├── modules/
│   ├── employees/
│   │   ├── service.ts            # regras de negócio
│   │   ├── repository.ts         # acesso a dados
│   │   └── schemas.ts            # Zod
│   ├── payroll/
│   ├── attendance/
│   └── ...
├── payroll-engine/               # cálculo puro: recebe contexto, devolve recibos + rasto
├── jobs/                         # definição das tarefas da fila
└── integrations/
    ├── banks/                    # formatos de ficheiro por banco
    ├── agt/
    ├── inss/
    ├── sms/
    └── email/

worker/
└── index.ts                      # arranca o pg-boss e regista server/jobs

prisma/
├── schema.prisma
├── migrations/
└── seed.ts                       # províncias, municípios, bancos, tabelas legais, rubricas

components/                       # UI (ui/, layout/, charts/, payroll/, ...)
hooks/
lib/                              # utilitários seguros para o cliente (formatKz, formatDate)
```

> O repositório chama-se actualmente `frontend`. Como passa a conter toda a aplicação, deveria ser renomeado (ex.: `pagador`).

## 9.5 Regras de camadas

1. **Toda a lógica de negócio vive em `server/modules`.** Componentes, Server Actions e Route Handlers são finos: autenticam, validam a entrada com Zod e chamam um serviço.
2. **Uma só implementação por operação.** A Server Action `approvePayrollRun` (usada pela interface) e o endpoint `POST /api/v1/payroll/runs/{id}/approve` (API pública) chamam o mesmo `payrollService.approve(ctx, id)`.
3. **Autorização no serviço, sempre.** Cada função de serviço recebe um contexto (`ctx`: utilizador, tenant, empresa, papéis) e chama `authorize` antes de agir. Esconder um botão na interface nunca é a única barreira; o `middleware.ts` só trata da sessão e das redirecções.
4. **Isolamento de clientes na base de dados.** Cada transacção define `app.tenant_id`; as políticas de Row-Level Security do PostgreSQL impedem leituras entre tenants mesmo em caso de erro no código.
5. **`server-only`** em todos os ficheiros de `server/`, para que o build falhe se forem importados num componente cliente.
6. **Leitura em Server Components**, chamando serviços directamente; **mutações em Server Actions**, seguidas de `revalidatePath`/`revalidateTag`. TanStack Query só nos ecrãs com muita interactividade no cliente (grelhas de lançamentos, actualização periódica).
7. **Nenhum cálculo de folha no cliente.** A interface apresenta os resultados e o rasto de cálculo produzidos pelo `payroll-engine`.
8. **Auditoria transaccional.** Cada mutação escreve o registo de auditoria na mesma transacção da alteração.
9. **Valores monetários** sempre como `Decimal` (Prisma/decimal.js) no servidor e como string na fronteira JSON; nunca `number`.

## 9.6 Motor de cálculo da folha

- Módulo **puro** em `server/payroll-engine`: sem acesso à base de dados, à rede nem ao relógio. Recebe um contexto completo (contratos, assiduidade, lançamentos, tabelas legais vigentes) e devolve recibos e rasto de cálculo.
- Totalmente coberto por testes Vitest, incluindo o exemplo de referência do [documento 04](./04-folha-de-pagamento.md#46-exemplo-de-cálculo) e as fronteiras de cada escalão de IRT.
- Avaliador de fórmulas próprio (sem `eval` nem `new Function`), com lista fechada de funções.
- Execução:
  - **Até ~50 trabalhadores:** síncrona, dentro da Server Action.
  - **Acima disso:** a acção enfileira a tarefa `payroll.calculate`; o worker processa por lotes e publica o progresso, que a interface recebe por SSE.
- As versões das tabelas legais usadas ficam gravadas em cada processamento, para permitir reprocessamentos idênticos.

## 9.7 Tarefas em segundo plano e agendadas

| Tarefa | Disparo |
| --- | --- |
| `payroll.calculate` | Pedido de cálculo de uma folha grande |
| `payslips.render-pdf` / `payslips.send` | Aprovação da folha |
| `payments.generate-bank-file` | Aprovação do lote de pagamento |
| `tax-filings.generate` | Pedido do utilizador / fecho da folha |
| `imports.process` | Upload de Excel de trabalhadores ou lançamentos |
| `notifications.deliver` | E-mail, SMS, WhatsApp |
| `alerts.daily` | Diária às 06:00 (Africa/Luanda): contratos a terminar, documentos a expirar, períodos experimentais, prazos AGT/INSS |
| `attendance.daily-close` | Diária: consolidação dos dias de assiduidade |

As tarefas agendadas são registadas no pg-boss (`schedule`) no arranque do worker. As rotas `app/api/cron/[job]` existem apenas para agendadores externos e exigem um segredo partilhado.

As tarefas são **idempotentes** (podem ser repetidas sem efeitos duplicados) e têm novas tentativas com espera crescente.

## 9.8 Tempo real

- **SSE** em `app/api/events/route.ts`: o navegador abre uma ligação e recebe eventos do utilizador (novas notificações, mensagens, progresso do cálculo).
- O worker e os serviços publicam eventos com `NOTIFY` do PostgreSQL; o processo web subscreve com `LISTEN` e reencaminha para as ligações SSE abertas. Funciona com várias instâncias sem Redis.
- O envio de mensagens é um `POST` normal (Server Action); só a recepção usa SSE.
- A dependência `socket.io-client` deixa de ser necessária: o Socket.IO exigiria um servidor personalizado à volta do Next.js.

## 9.9 API pública

- Implementada em `app/api/v1/**/route.ts`, sobre os mesmos serviços da interface.
- Autenticação OAuth 2.0 (client credentials) com âmbitos; limites de pedidos por cliente.
- Especificação OpenAPI 3.1 gerada a partir dos esquemas Zod e servida em `/api/v1/openapi.json`.
- Webhooks enviados pelo worker (tarefa `webhooks.deliver`), assinados com HMAC-SHA256.

Os recursos e eventos estão descritos em [07 — Integrações](./07-integracoes.md#79-api-pública-e-webhooks-plano-empresarial).

## 9.10 Convenções de código

- **Formatação** de moeda, datas e números via utilitários únicos (`formatKz`, `formatDate`), baseados em `Intl` com `pt-AO`.
- **Textos** da interface externalizados (`next-intl`), com `pt-AO` por omissão.
- **Erros de domínio** tipados (`NotFound`, `Forbidden`, `ValidationError`, `BusinessRuleViolation`), convertidos num formato único de resposta nas Server Actions e na API.
- **Componentes de domínio** em `components/<módulo>/`; primitivas genéricas apenas em `components/ui/`.
- **Variáveis de ambiente** validadas com Zod no arranque (`server/env.ts`).

## 9.11 Infra-estrutura e DevOps

- Imagem Docker única, com dois comandos: `node server.js` (web) e `node worker.js` (worker).
- Ambientes: desenvolvimento (`docker compose` com PostgreSQL e MinIO), QA, pré-produção (dados anonimizados) e produção.
- Alojamento em infra-estrutura com baixa latência para Luanda e conforme as regras de transferência internacional de dados; opção de instalação dedicada para grandes clientes.
- CI/CD: lint, verificação de tipos, testes, análise de dependências, `prisma migrate deploy` e deploy automático para QA; produção com aprovação manual.
- Feature flags para activar funcionalidades por plano e por cliente.
- Proibição de deploys de risco nos últimos 5 dias úteis de cada mês (período de fecho de folhas).

## 9.12 Fora do âmbito nesta fase

- **Aplicação móvel nativa** (Android/iOS). Consequências: o ponto é registado no navegador; não há registo de ponto offline nem notificações push nativas. Quando a aplicação for desenvolvida, consumirá a mesma API `v1`.
