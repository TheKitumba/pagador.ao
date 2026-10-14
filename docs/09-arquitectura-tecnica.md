# 09 — Arquitectura técnica

## 9.1 Decisão de arquitectura

O sistema é composto por **dois projectos TypeScript independentes**:

| Projecto | Pasta | Responsabilidade |
| --- | --- | --- |
| **Interface (frontend)** | `frontend/` | Aplicação Next.js (App Router): ecrãs, navegação, formulários e apresentação. Não contém regras de negócio nem acesso à base de dados. |
| **API (backend)** | `api.pagador.ao/` | Aplicação NestJS: regras de negócio, persistência, autenticação e autorização, tarefas em segundo plano, integrações e API pública. Organizada segundo **Domain-Driven Design** e **Clean Architecture**. |

| Decisão | Motivo |
| --- | --- |
| Backend separado da interface | Uma única fonte de verdade para as regras de negócio, servida à interface web, à API pública e à futura aplicação móvel |
| NestJS no backend | Injecção de dependências, módulos e ciclo de vida que suportam bem as camadas de DDD; mesma linguagem do frontend |
| Monólito modular por contextos delimitados | Fronteiras claras entre domínios de RH, sem o custo operacional de microsserviços; um contexto pode ser extraído mais tarde sem reescrita |
| Alojamento em servidores próprios (Docker) | Controlo sobre a residência dos dados (Lei n.º 22/11), processos de longa duração e custos previsíveis |
| Aplicação móvel nativa **fora do âmbito nesta fase** | O portal do trabalhador é uma aplicação web responsiva, usada no navegador do telemóvel |

Domínios em produção: `app.pagador.ao` (interface) e `api.pagador.ao` (API).

## 9.2 Visão geral

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Navegador (computador, tablet, telemóvel)        Sistemas de clientes    │
└──────────────┬──────────────────────────────────────────┬───────────────┘
               │ HTTPS                                    │ HTTPS (OAuth 2.0)
┌──────────────▼────────────────────┐                     │
│ frontend/ — Next.js               │                     │
│ app.pagador.ao                    │                     │
│ rotas · queries · services (Axios)│                     │
│ TanStack Query · Server Actions   │                     │
└──────────────┬────────────────────┘                     │
               │ HTTPS (cookie de sessão) + WebSocket     │
┌──────────────▼──────────────────────────────────────────▼───────────────┐
│ api.pagador.ao/ — NestJS (processo API)                                  │
│                                                                          │
│  presentation   controllers REST · /v1 pública · gateway Socket.IO       │
│        │                                                                 │
│  application    casos de uso (commands / queries) · portas               │
│        │                                                                 │
│  domain         agregados · objectos de valor · eventos · motor da folha │
│        ▲                                                                 │
│  infrastructure repositórios Prisma · bancos · AGT · INSS · SMS · e-mail │
└──────┬───────────────────────┬──────────────────────┬───────────────────┘
       │                       │ enfileira tarefas    │
┌──────▼─────────────────┐ ┌───▼──────────────┐ ┌─────▼────────────────────┐
│ PostgreSQL             │ │ Redis            │ │ Worker (mesmo código,    │
│ dados · RLS por tenant │ │ filas BullMQ     │◄┤ segundo processo):       │
│ outbox de eventos      │ │ pub/sub Socket.IO│ │ cálculo em massa, PDF,   │
└────────────────────────┘ └──────────────────┘ │ ficheiros bancários,     │
                                                │ notificações, agendadas  │
                                                └─────────────┬────────────┘
                                                              ▼
                                              Armazenamento de objectos (S3)
                                              documentos, recibos PDF, ficheiros
```

**Porque existe um worker:** um pedido HTTP não deve ficar à espera do cálculo de 1 000 recibos nem da geração de 1 000 PDF. Essas tarefas correm num processo Node separado (`node dist/worker.js`), que faz parte de `api.pagador.ao/` e executa exactamente os mesmos casos de uso. Não é outro backend: é o mesmo código num segundo processo.

## 9.3 Stack

### Interface (`frontend/`)

| Área | Tecnologia |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript (modo `strict`) |
| Estilos e componentes | Tailwind CSS 3, shadcn/ui sobre Radix UI, Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) |
| Formulários | React Hook Form + Zod (validação de experiência de utilizador; a validação de negócio é sempre da API) |
| Cliente HTTP | Axios, com interceptores de renovação de sessão e normalização de erros (`ApiError`) |
| Estado de servidor | TanStack Query (hooks por domínio em `src/queries`) |
| Estado na URL | nuqs (filtros, paginação, separadores) |
| Estado global | `@bentoo/state-man` |
| Tempo real | `socket.io-client` |
| Gráficos | Recharts |
| Datas | date-fns (locale `pt`, fuso `Africa/Luanda`) |
| Notificações na interface | Sonner |
| Tema | next-themes (claro/escuro) |
| Textos | next-intl (`pt-AO` por omissão) |

### API (`api.pagador.ao/`)

| Área | Tecnologia |
| --- | --- |
| Framework | NestJS 11, TypeScript (modo `strict`) |
| Casos de uso e eventos | `@nestjs/cqrs` (CommandBus, QueryBus, EventBus) |
| Base de dados | PostgreSQL 16+ |
| ORM e migrações | Prisma (apenas na camada de infra-estrutura) |
| Valores monetários | decimal.js, encapsulado no objecto de valor `Money` |
| Validação de entrada | Zod (`nestjs-zod`) nos DTO da camada de apresentação |
| Autenticação | Passport (JWT, OIDC/SAML no plano Empresarial), OTP por SMS, 2FA (TOTP), Argon2id |
| Contexto do pedido | `nestjs-cls` (AsyncLocalStorage): utilizador, tenant, empresa, id de correlação |
| Fila e tarefas agendadas | BullMQ (`@nestjs/bullmq`) sobre Redis |
| Tempo real | Socket.IO (`@nestjs/websockets`) com adaptador Redis |
| Documentação da API | `@nestjs/swagger` (OpenAPI) |
| Limites de pedidos | `@nestjs/throttler` com armazenamento em Redis |
| PDF | `@react-pdf/renderer` (recibos e documentos como componentes React, gerados no worker) |
| Excel | ExcelJS (importação e exportação) |
| E-mail | Modelos em React Email, envio por SMTP ou fornecedor transaccional |
| Armazenamento | Cliente S3 compatível (MinIO em desenvolvimento) |
| Gestor de pacotes | pnpm |

## 9.4 Arquitectura da API: Domain-Driven Design

### 9.4.1 Contextos delimitados (bounded contexts)

Cada contexto agrupa um conjunto coeso de módulos funcionais ([documento 03](./03-modulos-funcionais.md)), tem o seu próprio modelo de domínio e é dono exclusivo das suas tabelas.

| Contexto | Módulos | Tipo |
| --- | --- | --- |
| `payroll` — folha de pagamento | M07, M09, M10, M11 | **Núcleo** |
| `tax-compliance` — obrigações fiscais e contributivas | M17 | **Núcleo** |
| `time` — assiduidade, férias e licenças | M05, M06 | **Núcleo** |
| `payments` — pagamentos e ficheiros bancários | M08 | Suporte |
| `workforce` — trabalhadores, contratos, cessação, expatriados, prestadores | M02, M04, M16, M22, M23 | Suporte |
| `organization` — empresas, estrutura, configurações | M01, M24 | Suporte |
| `recruitment` — recrutamento e admissão | M03 | Suporte |
| `talent` — desempenho e formação | M12, M13 | Suporte |
| `employee-relations` — disciplina e SST | M14, M15 | Suporte |
| `documents` — documentos e modelos | M20 | Genérico |
| `communication` — comunicação interna e notificações | M19 | Genérico |
| `analytics` — relatórios (só leitura) | M21 | Genérico |
| `identity-access` — utilizadores, sessões, papéis, permissões | [documento 05](./05-perfis-e-permissoes.md) | Genérico |
| `audit` — auditoria e conformidade | M25 | Genérico |

O portal do trabalhador (M18) não é um contexto: é uma superfície de apresentação que usa casos de uso de vários contextos com as permissões do próprio trabalhador.

### 9.4.2 Mapa de contextos

```
organization ──► workforce ──► time ──► payroll ──► payments
                     │                    │  └────► tax-compliance
                     └────────────────────┘
identity-access, audit, documents, communication: usados por todos
analytics: lê projecções publicadas pelos restantes
```

- **Comunicação síncrona** só através da **fachada pública** do contexto fornecedor (`<contexto>/public/`), que expõe consultas e tipos próprios, nunca entidades de domínio.
- **Camada anti-corrupção:** o contexto consumidor define uma **porta** com o modelo de que precisa (ex.: `payroll` define `EmploymentSnapshotPort`) e a infra-estrutura implementa-a com um adaptador que chama a fachada do fornecedor. Assim, a folha nunca depende da forma interna do contrato.
- **Comunicação assíncrona** por **eventos de integração** (ex.: `PayrollRunApproved`, `EmployeeHired`, `ContractTerminated`), gravados numa tabela **outbox** na mesma transacção da alteração e publicados pelo worker em BullMQ. Garante que nenhum evento se perde nem é publicado sem a alteração correspondente.

### 9.4.3 Camadas de cada contexto

```
presentation ──► application ──► domain ◄── infrastructure
```

| Camada | Contém | Pode depender de |
| --- | --- | --- |
| **domain** | Agregados, entidades, objectos de valor, eventos de domínio, serviços de domínio, interfaces de repositório, erros de domínio | Apenas `shared/domain` e bibliotecas puras (decimal.js) |
| **application** | Casos de uso (commands e queries com os seus handlers), portas para serviços externos, DTO de aplicação, handlers de eventos | `domain` |
| **infrastructure** | Repositórios Prisma, mappers, adaptadores (bancos, AGT, INSS, SMS, e-mail, S3), processadores BullMQ | `application`, `domain`, frameworks |
| **presentation** | Controllers REST, controllers da API pública `v1`, gateways Socket.IO, DTO de entrada/saída, guards | `application` |

A **regra de dependência** é absoluta: as setas apontam para dentro. O domínio não conhece NestJS, Prisma, HTTP nem filas, e é verificado automaticamente pelo lint (ver 9.6).

### 9.4.4 Blocos de construção

- **Agregados** protegem invariantes e são a unidade de consistência transaccional. Exemplos: `PayrollRun` (com os seus `Payslip`), `EmploymentContract`, `LeaveRequest`, `PaymentBatch`, `LegalTable`.
- **Comportamento no domínio, não nos serviços** (modelo rico, não anémico): `run.approve(approver, clock)` valida o estado, regista quem aprovou e emite `PayrollRunApproved`; nenhum caso de uso altera campos directamente.
- **Máquinas de estado explícitas** nos agregados com ciclo de vida (ex.: `PayrollRun`: `DRAFT → CALCULATED → APPROVED → PAID → CLOSED`); uma folha aprovada é imutável.
- **Objectos de valor** imutáveis e validados na criação: `Money`, `Nif`, `Iban`, `PhoneNumber`, `DateRange`, `EffectivePeriod`, `TenantId`. Dois objectos com os mesmos valores são iguais.
- **Repositórios** só para raízes de agregado, definidos como interface no domínio e implementados na infra-estrutura. Carregam e gravam o agregado completo.
- **Consultas (queries)** podem ler directamente da base de dados com modelos de leitura optimizados, sem passar pelo modelo de domínio (CQRS pragmático: um só banco, dois caminhos).
- **Serviços de domínio** para regras que não pertencem a uma só entidade, como o motor de cálculo da folha (9.6).

### 9.4.5 Linguagem ubíqua

O código usa nomes em inglês, alinhados com o [modelo de dados](./06-modelo-de-dados.md) e o [glossário](./12-glossario.md). A tradução é fixa e usada igualmente no código, na API e nas conversas da equipa:

| Termo de negócio | Nome no código |
| --- | --- |
| Trabalhador | `Employee` |
| Contrato de trabalho | `EmploymentContract` |
| Rubrica | `PayItem` |
| Período de processamento | `PayrollPeriod` |
| Processamento da folha | `PayrollRun` |
| Recibo de vencimento | `Payslip` |
| Tabela legal | `LegalTable` |
| Marcação de ponto | `AttendanceRecord` |
| Pedido de férias / ausência | `LeaveRequest` |
| Lote de pagamento | `PaymentBatch` |

## 9.5 Estrutura de pastas

### API (`api.pagador.ao/`)

```
src/
├── main.ts                          # arranque do processo API (HTTP + WebSocket)
├── worker.ts                        # arranque do worker (processadores BullMQ e agendamentos)
├── app.module.ts
├── worker.module.ts
├── shared/
│   ├── domain/                      # Entity, AggregateRoot, ValueObject, DomainEvent, DomainError
│   │   └── value-objects/           # Money, Nif, Iban, PhoneNumber, DateRange, TenantId
│   ├── application/                 # portas transversais: Clock, IdGenerator, UnitOfWork, FileStorage
│   ├── infrastructure/
│   │   ├── prisma/                  # PrismaService, transacção com app.tenant_id (RLS)
│   │   ├── outbox/                  # gravação e publicação de eventos de integração
│   │   ├── queue/                   # configuração BullMQ
│   │   ├── storage/                 # adaptador S3
│   │   └── config/                  # variáveis de ambiente validadas com Zod no arranque
│   └── presentation/                # filtros de erro, guards, interceptores, decorators
└── contexts/
    ├── payroll/
    │   ├── domain/
    │   │   ├── payroll-run.aggregate.ts
    │   │   ├── payslip.entity.ts
    │   │   ├── pay-item.entity.ts
    │   │   ├── value-objects/
    │   │   ├── events/              # payroll-run-approved.event.ts, ...
    │   │   ├── errors/              # payroll-run-not-editable.error.ts, ...
    │   │   ├── calculation/         # motor de cálculo e avaliador de fórmulas (puro)
    │   │   └── payroll-run.repository.ts      # interface
    │   ├── application/
    │   │   ├── commands/
    │   │   │   ├── calculate-payroll-run/     # command + handler
    │   │   │   └── approve-payroll-run/
    │   │   ├── queries/
    │   │   │   └── get-payslip/
    │   │   ├── ports/               # employment-snapshot.port.ts, attendance-summary.port.ts
    │   │   └── event-handlers/
    │   ├── infrastructure/
    │   │   ├── persistence/         # prisma-payroll-run.repository.ts, payroll-run.mapper.ts
    │   │   ├── adapters/            # implementação das portas (anti-corrupção)
    │   │   └── jobs/                # calculate-payroll.processor.ts
    │   ├── presentation/
    │   │   ├── http/                # payroll-runs.controller.ts, dto/
    │   │   └── public-api/          # controllers da API pública v1
    │   ├── public/                  # fachada exposta aos outros contextos
    │   └── payroll.module.ts
    ├── payments/
    │   └── infrastructure/bank-formats/       # um adaptador por banco
    ├── tax-compliance/
    │   └── infrastructure/          # agt/, inss/
    ├── communication/
    │   └── infrastructure/          # sms/, email/, whatsapp/
    ├── workforce/
    ├── time/
    ├── identity-access/
    └── ...                          # restantes contextos com a mesma estrutura

prisma/
├── schema.prisma
├── migrations/
└── seed.ts                          # províncias, municípios, bancos, tabelas legais, rubricas
```

As integrações externas não têm pasta própria de topo: cada uma é um adaptador na infra-estrutura do contexto que a usa.

> **Estado actual:** a API contém ainda o esqueleto inicial do NestJS (módulo `user` e `PrismaService` na raiz de `src/`). O módulo `user` passa para `contexts/identity-access` e o `PrismaService` para `shared/infrastructure/prisma`.

### Interface (`frontend/`)

Arquitectura em camadas organizada em **fatias verticais** por domínio. Uma funcionalidade percorre `api/types` → `api/services` → `schemas` → `queries` → `_components` da rota; a fatia `auth` serve de referência.

```
src/
├── actions/                      # Server Actions ("use server"), validadas com zod
├── app/                          # App Router — apenas rotas, sem lógica de negócio
│   ├── layout.tsx                # layout raiz (fontes, metadata, AppProvider)
│   ├── (public)/                 # sem autenticação (layout de autenticação)
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── _components/      # componentes usados só por esta rota
│   │   ├── register/
│   │   └── careers/[company]/
│   ├── (private)/                # área autenticada (layout com sidebar)
│   │   ├── page.tsx              # dashboard
│   │   ├── employees/
│   │   ├── payroll/
│   │   └── ...
│   └── (portal)/                 # portal do trabalhador (web responsiva)
├── api/                          # camada HTTP (independente do framework)
│   ├── lib/                      # instância Axios, interceptores, gestor de sessão, ApiError
│   ├── services/                 # uma classe de serviço por domínio (auth.service.ts, ...)
│   └── types/                    # tipos de pedido/resposta por domínio, alinhados com os DTO da API
├── components/
│   ├── ui/                       # primitivas shadcn/ui
│   ├── common/                   # blocos da aplicação: PageHeader, PageTabs, DataTable, StatCard, StatusBadge
│   ├── charts/                   # gráficos com resumo textual acessível
│   └── <domínio>/                # componentes de domínio partilhados por várias rotas
├── config/                       # env (zod), URL da API, constantes e navigation.ts (menu, pesquisa ⌘K, títulos)
├── hooks/                        # hooks React partilhados
├── layouts/                      # AppShell, AppSidebar, CommandMenu, CreateMenu, AuthLayout, PortalShell
├── lib/                          # utilitários (cn, formatKz, formatDate), queryClient global do TanStack Query
├── mocks/                        # dados de demonstração, substituídos pelos hooks de queries/ quando a API existir
├── providers/                    # AppProvider: tema, TanStack Query, nuqs, toasts
├── queries/                      # hooks TanStack Query por domínio: use…Query (query.ts) e use…Mutation (mutation.ts)
├── schemas/                      # esquemas Zod dos formulários por domínio
├── services/                     # serviços de interface (toast, ...)
├── stores/                       # estado global (@bentoo/state-man)
└── middleware.ts                 # redirecção conforme a presença de sessão
```

Aliases: `@/*` → `src/*`, `@api/*` → `src/api/*`. Detalhes e convenções no `README.md` do frontend.

## 9.6 Regras de camadas

1. **Toda a lógica de negócio vive no domínio e nos casos de uso da API.** O frontend apresenta dados e envia intenções; nunca decide regras.
2. **Uma só implementação por operação.** O endpoint interno usado pela interface e o endpoint `POST /v1/payroll/runs/{id}/approve` da API pública executam o mesmo comando `ApprovePayrollRunCommand`.
3. **Controllers finos:** validam a entrada (Zod), constroem o command ou a query e devolvem o resultado mapeado para DTO. Sem `if` de negócio.
4. **Um caso de uso por classe**, com um único método público `execute`. O handler carrega o agregado, chama o seu comportamento, grava e publica eventos, tudo numa unidade de trabalho.
5. **Autorização no caso de uso, sempre.** Cada handler verifica a permissão (`payroll.approve`) com o contexto do pedido (utilizador, tenant, empresa, papéis). Guards e o `middleware.ts` do frontend tratam apenas de autenticação e redirecção.
6. **Isolamento de clientes na base de dados.** Cada transacção define `app.tenant_id`; as políticas de Row-Level Security do PostgreSQL impedem leituras entre tenants mesmo em caso de erro no código.
7. **Fronteiras verificadas pelo lint** (`eslint-plugin-boundaries`): o domínio não importa `@nestjs/*` nem `@prisma/client`; um contexto não importa nada de outro contexto excepto a sua pasta `public/`.
8. **Modelos Prisma nunca saem da infra-estrutura.** Mappers explícitos convertem registo ↔ agregado; entidades de domínio nunca são serializadas directamente para JSON.
9. **Auditoria transaccional.** Cada mutação escreve o registo de auditoria e os eventos da outbox na mesma transacção da alteração.
10. **Valores monetários** sempre como `Money` no domínio, `Decimal` na base de dados e string na fronteira JSON; nunca `number`.
11. **Nenhum cálculo de folha no frontend.** A interface apresenta os resultados e o rasto de cálculo produzidos pela API.

## 9.7 Motor de cálculo da folha

- Serviço de domínio **puro** em `contexts/payroll/domain/calculation`: sem acesso à base de dados, à rede nem ao relógio. Recebe um contexto completo (dados contratuais, assiduidade, lançamentos, tabelas legais vigentes) e devolve recibos e rasto de cálculo.
- Os dados de entrada chegam pelas portas `EmploymentSnapshotPort` e `AttendanceSummaryPort`, já traduzidos para o modelo da folha.
- Avaliador de fórmulas próprio (sem `eval` nem `new Function`), com lista fechada de funções.
- Execução:
  - **Até ~50 trabalhadores:** síncrona, dentro do pedido HTTP.
  - **Acima disso:** o caso de uso enfileira a tarefa `payroll.calculate`; o worker processa por lotes e publica o progresso, que a interface recebe por Socket.IO.
- As versões das tabelas legais usadas ficam gravadas em cada processamento, para permitir reprocessamentos idênticos.

## 9.8 Tarefas em segundo plano e agendadas

| Tarefa | Disparo |
| --- | --- |
| `payroll.calculate` | Pedido de cálculo de uma folha grande |
| `payslips.render-pdf` / `payslips.send` | Evento `PayrollRunApproved` |
| `payments.generate-bank-file` | Evento `PaymentBatchApproved` |
| `tax-filings.generate` | Pedido do utilizador / fecho da folha |
| `imports.process` | Upload de Excel de trabalhadores ou lançamentos |
| `notifications.deliver` | E-mail, SMS, WhatsApp |
| `outbox.publish` | Contínua: publica os eventos de integração pendentes |
| `webhooks.deliver` | Eventos subscritos por clientes da API pública |
| `alerts.daily` | Diária às 06:00 (Africa/Luanda): contratos a terminar, documentos a expirar, períodos experimentais, prazos AGT/INSS |
| `attendance.daily-close` | Diária: consolidação dos dias de assiduidade |

- As tarefas agendadas são registadas como *job schedulers* do BullMQ (com fuso `Africa/Luanda`) no arranque do worker.
- Os processadores são adaptadores de infra-estrutura: recebem a tarefa e executam o command correspondente, sem lógica própria.
- As tarefas são **idempotentes** (podem ser repetidas sem efeitos duplicados) e têm novas tentativas com espera crescente.

## 9.9 Tempo real

- **Gateway Socket.IO** na API (`/realtime`): o navegador liga-se com `socket.io-client` e recebe eventos do utilizador (novas notificações, mensagens, progresso do cálculo).
- Autenticação no *handshake* com o mesmo cookie de sessão; cada ligação entra nas salas `user:<id>` e `tenant:<id>`.
- O adaptador Redis do Socket.IO permite várias instâncias da API; o worker emite eventos através do emissor Redis, sem abrir ligações próprias.
- O envio de mensagens é um pedido HTTP normal; o Socket.IO serve apenas para a recepção.

## 9.10 Autenticação entre frontend e API

- A API emite um **token de acesso** JWT de curta duração (15 min) e um **token de renovação** rotativo (guardado com hash na base de dados), ambos em cookies `HttpOnly`, `Secure`, `SameSite=Lax`, no domínio `.pagador.ao`.
- O frontend chama a API com Axios (`withCredentials: true`). Os tokens nunca são lidos em JavaScript: numa resposta 401, o interceptor pede `POST /auth/refresh` (um único pedido partilhado por todas as chamadas em curso) e repete o pedido original; se a renovação falhar, redirecciona para `/login`.
- As Server Actions que chamem a API reencaminham o cookie de sessão do pedido.
- Protecção CSRF nas mutações: `SameSite` mais verificação do cabeçalho `Origin` contra a lista de origens permitidas.
- 2FA (TOTP), OTP por SMS e SSO (OIDC/SAML, plano Empresarial) são estratégias do contexto `identity-access`.

## 9.11 API pública

- Controllers em `presentation/public-api` de cada contexto, sob o prefixo `/v1`, sobre os mesmos casos de uso da interface.
- Autenticação OAuth 2.0 (client credentials) com âmbitos; limites de pedidos por cliente.
- Especificação OpenAPI gerada pelo `@nestjs/swagger` e servida em `/v1/openapi.json`. Os tipos de `frontend/src/api/types` seguem esta especificação e são actualizados sempre que o contrato muda.
- Webhooks enviados pelo worker (tarefa `webhooks.deliver`), assinados com HMAC-SHA256.

Os recursos e eventos estão descritos em [07 — Integrações](./07-integracoes.md#79-api-pública-e-webhooks-plano-empresarial).

## 9.12 Código limpo (clean code)

**Nomes**

- Nomes da linguagem ubíqua (9.4.5), descritivos e pronunciáveis. Proibidos nomes genéricos como `Manager`, `Helper`, `Utils`, `Data`, `Info`.
- Classes são substantivos (`PayrollRun`), métodos são verbos de negócio (`approve`, `terminate`, `recalculate`), booleanos lêem-se como pergunta (`isApproved`, `hasOverlap`).
- Ficheiros nomeados pelo papel: `*.aggregate.ts`, `*.entity.ts`, `*.vo.ts`, `*.event.ts`, `*.error.ts`, `*.command.ts`, `*.handler.ts`, `*.repository.ts`, `*.mapper.ts`, `*.controller.ts`, `*.processor.ts`.

**Funções e classes**

- Funções curtas, com um só nível de abstracção e no máximo três parâmetros (acima disso, um objecto tipado).
- Sem parâmetros booleanos que mudam o comportamento: dois métodos com nomes claros.
- Cláusulas de guarda em vez de `if` aninhados.
- Responsabilidade única: uma classe muda por um único motivo.
- Dependências injectadas pelo construtor, sempre por interface (porta) quando atravessam camadas.

**Tipos e valores**

- TypeScript `strict`; proibidos `any` e asserções não-nulas (`!`) sem justificação.
- Sem obsessão por primitivos: `Money`, `Nif`, `Iban` e `EffectivePeriod` em vez de `string` ou `number`.
- Sem números mágicos: taxas, escalões e limites legais vêm sempre de `LegalTable`.
- Imutabilidade por omissão (`readonly`); o estado de um agregado só muda através dos seus métodos.

**Erros**

- Erros de domínio tipados e específicos (`PayrollRunNotEditableError`, `ContractPeriodOverlapError`), derivados de `NotFound`, `Forbidden`, `ValidationError` e `BusinessRuleViolation`.
- Um filtro global converte-os em respostas no formato *Problem Details* (RFC 9457), com código de erro estável que o frontend traduz.
- Nunca engolir excepções; nunca devolver `null` para indicar erro.

**Comentários e formatação**

- Comentários explicam o *porquê* (ex.: referência ao artigo da LGT), nunca o *quê*; código comentado é apagado.
- ESLint + Prettier obrigatórios e aplicados em cada *commit*.
- Formatação de moeda, datas e números via utilitários únicos (`formatKz`, `formatDate`), baseados em `Intl` com `pt-AO`.
- No frontend: componentes de uma só rota em `_components/` junto ao `page.tsx`; componentes de domínio partilhados em `components/<módulo>/`; primitivas genéricas apenas em `components/ui/`.

## 9.13 Infra-estrutura e DevOps

- Duas imagens Docker:
  - `pagador-web` — Next.js com `output: "standalone"` (`node server.js`).
  - `pagador-api` — NestJS, com dois comandos: `node dist/main.js` (API) e `node dist/worker.js` (worker).
- Serviços de suporte: PostgreSQL 16, Redis 7 e armazenamento S3 compatível. Em desenvolvimento, `api.pagador.ao/docker-compose.yml` arranca PostgreSQL e Redis; o MinIO deve ser acrescentado.
- Ambientes: desenvolvimento, QA, pré-produção (dados anonimizados) e produção.
- Alojamento em infra-estrutura com baixa latência para Luanda e conforme as regras de transferência internacional de dados; opção de instalação dedicada para grandes clientes.
- CI/CD por projecto: lint (incluindo fronteiras de camadas), verificação de tipos, análise de dependências e build; na API, `prisma migrate deploy`; deploy automático para QA e produção com aprovação manual.
- A API é sempre publicada antes do frontend quando o contrato muda; alterações incompatíveis exigem nova versão da API pública.
- Feature flags para activar funcionalidades por plano e por cliente.
- Proibição de deploys de risco nos últimos 5 dias úteis de cada mês (período de fecho de folhas).

## 9.14 Fora do âmbito nesta fase

- **Aplicação móvel nativa** (Android/iOS). Consequências: o ponto é registado no navegador; não há registo de ponto offline nem notificações push nativas. Quando a aplicação for desenvolvida, consumirá a mesma API `v1`.
