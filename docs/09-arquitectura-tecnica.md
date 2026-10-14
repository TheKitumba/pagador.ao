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
| Casos de uso e eventos | Uma classe por caso de uso (`execute`), injectada directamente; eventos de domínio gravados na outbox |
| Base de dados | PostgreSQL 16+ |
| ORM e migrações | Prisma (apenas na camada de infra-estrutura) |
| Valores monetários | decimal.js, encapsulado no objecto de valor `Money` |
| Validação de entrada | Zod (`nestjs-zod`) nos DTO da camada de apresentação |
| Autenticação | JWT assinado com **RS256** (`@nestjs/jwt`, par de chaves PEM), OTP por SMS/e-mail, 2FA (TOTP com otplib), Argon2id (`@node-rs/argon2`); OIDC/SAML no plano Empresarial |
| Contexto do pedido | `nestjs-cls` (AsyncLocalStorage): utilizador, tenant, empresa, id de correlação |
| Fila e tarefas agendadas | BullMQ (`@nestjs/bullmq`) sobre Redis |
| Tempo real | Socket.IO (`@nestjs/websockets`) com adaptador Redis |
| Documentação da API | `@nestjs/swagger` (OpenAPI 3) gerado a partir dos esquemas Zod; Swagger UI em `/v1/docs` |
| Limites de pedidos | `@nestjs/throttler` (limite estrito nas rotas de autenticação) |
| PDF | PDFKit (recibos de vencimento) |
| Importação e exportação | CSV com `;` e BOM UTF-8 (abre directamente no Excel em pt-AO) |
| E-mail | Nodemailer com o transporte Gmail (palavra-passe de aplicação Google); sem credenciais, os e-mails são apenas registados no log |
| Armazenamento | MinIO (compatível com S3) através do `@aws-sdk/client-s3`; o bucket é criado no arranque |
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
- **Comunicação assíncrona** por **eventos de integração** (ex.: `payroll_run.approved`, `employee.created`, `employee.terminated`), gravados numa tabela **outbox** na mesma transacção da alteração e publicados pelo worker em BullMQ. Garante que nenhum evento se perde nem é publicado sem a alteração correspondente.
- **Resultado de aprovações:** o contexto `approvals` não conhece os restantes; cada contexto regista no arranque um tratador no `ApprovalOutcomeRegistry` (ex.: `payroll` para `PAYROLL_RUN`) que é chamado, na mesma transacção, quando o último passo é decidido.

### 9.4.3 Camadas de cada contexto

```
presentation ──► application ──► domain ◄── infrastructure
```

| Camada | Contém | Pode depender de |
| --- | --- | --- |
| **domain** | Agregados, entidades, objectos de valor, eventos de domínio, serviços de domínio, interfaces de repositório, erros de domínio | Apenas `shared/domain` e bibliotecas puras (decimal.js) |
| **application** | Casos de uso (uma classe com `execute`), serviços de consulta, portas para serviços externos, utilitários de leitura (`formatting`, `csv`) | `domain` |
| **infrastructure** | Repositórios Prisma, mappers, adaptadores (bancos, AGT, INSS, SMS, e-mail, S3), processadores BullMQ | `application`, `domain`, frameworks |
| **presentation** | Controllers REST, controllers da API pública `v1`, gateways Socket.IO, DTO de entrada/saída, guards | `application` |

A **regra de dependência** é absoluta: as setas apontam para dentro. O domínio não conhece NestJS, Prisma, HTTP nem filas, e é verificado automaticamente pelo lint (ver 9.6).

### 9.4.4 Blocos de construção

- **Agregados** protegem invariantes e são a unidade de consistência transaccional. Exemplos: `PayrollRun` (com os seus `Payslip`), `EmploymentContract`, `LeaveRequest`, `PaymentBatch`, `LegalTable`.
- **Comportamento no domínio, não nos serviços** (modelo rico, não anémico): `run.approve(approver, clock)` valida o estado, regista quem aprovou e emite `PayrollRunApproved`; nenhum caso de uso altera campos directamente.
- **Máquinas de estado explícitas** nos agregados com ciclo de vida (ex.: `PayrollRun`: `DRAFT → CALCULATED → APPROVED → PAID → CLOSED`); uma folha aprovada é imutável.
- **Objectos de valor** imutáveis e validados na criação: `Money`, `Nif`, `Iban`, `PhoneNumber`, `DateRange`, `EffectivePeriod`, `TenantId`. Dois objectos com os mesmos valores são iguais.
- **Repositórios** só para raízes de agregado, definidos como interface no domínio e implementados na infra-estrutura. Carregam e gravam o agregado completo.
- **Consultas (queries)** podem ler directamente da base de dados com modelos de leitura optimizados, sem passar pelo modelo de domínio (CQRS pragmático: um só banco, dois caminhos). Só o lado de leitura pode juntar tabelas de vários contextos; o lado de escrita usa sempre as fachadas `public/`.
- **Catálogos de referência** (estrutura orgânica, rubricas, centros de custo, formação) não têm invariantes que justifiquem agregados: usam serviços de aplicação simples, com autorização e auditoria iguais às dos casos de uso.
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
├── main.ts                          # processo API: HTTP + Socket.IO (adaptador Redis), Swagger em /v1/docs
├── worker.ts                        # processo worker (BullMQ), sem HTTP
├── seed.ts                          # dados de referência e empresa de demonstração, através dos casos de uso
├── app.module.ts                    # guards, pipes, interceptores e filtros globais
├── health.controller.ts             # GET /v1/health
├── contexts/
│   ├── index.ts                     # CONTEXT_MODULES, partilhado pela API, worker e seed
│   ├── payroll/
│   │   ├── domain/
│   │   │   ├── payroll-run.ts                 # agregado e máquina de estados
│   │   │   ├── default-pay-items.ts
│   │   │   └── calculation/                   # motor de cálculo, tabelas legais, avaliador de fórmulas (puro)
│   │   ├── application/
│   │   │   ├── ports.ts                       # EmploymentSnapshotPort, AttendanceSummaryPort
│   │   │   ├── payroll-runs.use-cases.ts      # Create/Calculate/Submit/Close… (uma classe por caso de uso)
│   │   │   ├── compensation.use-cases.ts      # empréstimos, despesas, benefícios
│   │   │   ├── payslips.service.ts
│   │   │   └── payroll-config.service.ts      # rubricas e tabelas legais
│   │   ├── infrastructure/                    # adaptadores das portas, parâmetros legais, PDF do recibo
│   │   ├── presentation/payroll.controller.ts
│   │   ├── public/index.ts                    # fachada: PayrollProvisioning, LoanBalances, PayrollRunsFacade
│   │   └── payroll.module.ts
│   ├── payments/infrastructure/bank-file-formats.ts   # PS2 (largura fixa) e CSV
│   ├── approvals/                   # pedidos multi-passo, segregação de funções, ApprovalOutcomeRegistry
│   ├── workforce/  time/  organization/  identity-access/  tax-compliance/
│   ├── recruitment/  talent/  employee-relations/  communication/  analytics/  audit/
│   └── …                            # todos com domain/ application/ infrastructure/ presentation/ public/
├── portal/                          # GET /v1/me/summary (superfície do portal, sem domínio próprio)
├── worker/
│   ├── worker.module.ts
│   ├── processors.ts                # outbox, cálculo da folha, alertas diários
│   └── notification-projector.ts    # eventos → notificações, e-mails e evento realtime
└── shared/
    ├── domain/                      # AggregateRoot, erros, Money, Nif, Iban, PhoneNumber
    ├── application/                 # permissões, portas (FileStorage, Mailer, SmsSender), paginação, formatação, CSV
    ├── infrastructure/
    │   ├── prisma/                  # PrismaService e Database (transacção com app.tenant_id — RLS)
    │   ├── audit/                   # registo encadeado por hash (JSON canónico)
    │   ├── outbox/  queue/  context/
    │   ├── storage/                 # MinIO/S3
    │   ├── messaging/               # Nodemailer (Gmail), SMS
    │   └── config/                  # variáveis de ambiente validadas com Zod no arranque
    └── presentation/                # AuthGuard, filtro Problem Details, verificação de Origin, Swagger, esquemas Zod comuns

prisma/
├── schema.prisma
└── migrations/                      # a migração inicial inclui as políticas de Row-Level Security
```

As integrações externas não têm pasta própria de topo: cada uma é um adaptador na infra-estrutura do contexto que a usa.

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
2. **Uma só implementação por operação.** A interface, a API pública e o worker chamam a mesma classe de caso de uso (ex.: o worker executa `PayrollRunCalculation` tal como o pedido HTTP).
3. **Controllers finos:** validam a entrada (Zod), chamam o caso de uso e devolvem o resultado. Sem `if` de negócio.
4. **Um caso de uso por classe**, com um único método público `execute`. Carrega o agregado, chama o seu comportamento, grava e publica eventos, tudo numa unidade de trabalho: um interceptor abre uma transacção por pedido com `app.tenant_id` definido.
5. **Autorização no caso de uso, sempre.** Cada handler verifica a permissão (`payroll.approve`) com o contexto do pedido (utilizador, tenant, empresa, papéis). Guards e o `middleware.ts` do frontend tratam apenas de autenticação e redirecção.
6. **Isolamento de clientes na base de dados.** Cada transacção define `app.tenant_id`; as políticas de Row-Level Security do PostgreSQL impedem leituras entre tenants mesmo em caso de erro no código.
7. **Fronteiras de camadas:** o domínio não importa `@nestjs/*` nem `@prisma/client`; `application` não importa `presentation`; um contexto só importa de outro a sua pasta `public/`. Hoje verificadas na revisão de código; a regra automática (`eslint-plugin-boundaries`) está por configurar.
8. **Agregados persistidos por repositórios.** Os agregados com regras (`PayrollRun`, `ApprovalRequest`) são carregados e gravados por repositórios na infra-estrutura, com mappers explícitos. Consultas e serviços de catálogo usam o cliente da transacção (`Database.tx`) e devolvem formas de leitura próprias; entidades de domínio nunca são serializadas directamente para JSON.
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

| Tarefa | Disparo | Estado |
| --- | --- | --- |
| `outbox.publish` | Contínua (a cada 2 s): publica os eventos pendentes, cada um na transacção do seu tenant | Implementada |
| `payroll.calculate` | Cálculo de uma folha com mais de 50 trabalhadores | Implementada |
| `alerts.daily` | Diária às 07:00 (Africa/Luanda): contratos a terminar, documentos a expirar, exames médicos, prazos AGT/INSS | Implementada |
| `notifications.deliver` | E-mail (Gmail) dos pedidos de aprovação; SMS e WhatsApp mais tarde | E-mail implementado no projector da outbox |
| `payslips.send` | Envio dos recibos por e-mail | Hoje pedido a pedido (`POST /v1/payslips/{id}/send`) |
| `imports.process` | Importação de trabalhadores | Hoje síncrona (CSV, com validação prévia `dryRun`) |
| `webhooks.deliver` | Eventos subscritos por clientes da API pública | Planeada |
| `attendance.daily-close` | Diária: consolidação dos dias de assiduidade | Planeada |

O projector da outbox (`worker/notification-projector.ts`) converte eventos em notificações para os papéis certos (ex.: `approval.requested` → aprovador do passo, excluindo quem não pode decidir; `payroll_run.paid` → cada trabalhador com recibo), envia o e-mail aos aprovadores e emite `domain.event` para a sala do tenant, que a interface usa para invalidar as suas queries.

- As tarefas agendadas são registadas como *job schedulers* do BullMQ (com fuso `Africa/Luanda`) no arranque do worker.
- Os processadores são adaptadores de infra-estrutura: recebem a tarefa e executam o caso de uso correspondente, sem lógica própria.
- As tarefas são **idempotentes** (podem ser repetidas sem efeitos duplicados) e têm novas tentativas com espera crescente.

## 9.9 Tempo real

- **Gateway Socket.IO** na API (`/realtime`): o navegador liga-se com `socket.io-client` e recebe eventos do utilizador (novas notificações, mensagens, progresso do cálculo).
- Autenticação no *handshake* com o mesmo cookie de sessão; cada ligação entra nas salas `user:<id>` e `tenant:<id>`.
- O adaptador Redis do Socket.IO permite várias instâncias da API; o worker emite eventos através do emissor Redis, sem abrir ligações próprias.
- O envio de mensagens é um pedido HTTP normal; o Socket.IO serve apenas para a recepção.

## 9.10 Autenticação entre frontend e API

- A API emite um **token de acesso** JWT de curta duração (15 min), assinado com **RS256** (chave privada só na API; a pública basta para validar, por exemplo noutro serviço), e um **token de renovação** rotativo e opaco (guardado com hash SHA-256 na base de dados; a reutilização de um token já rodado revoga a família inteira). Ambos vão em cookies `HttpOnly`, `Secure`, `SameSite=Lax`, no domínio `.pagador.ao`; o de renovação só é enviado para `/v1/auth`.
- O mesmo token de acesso pode ser enviado em `Authorization: Bearer` por integrações.
- O frontend chama a API com Axios (`withCredentials: true`). Os tokens nunca são lidos em JavaScript: numa resposta 401, o interceptor pede `POST /auth/refresh` (um único pedido partilhado por todas as chamadas em curso) e repete o pedido original; se a renovação falhar, redirecciona para `/login`.
- As Server Actions que chamem a API reencaminham o cookie de sessão do pedido.
- Protecção CSRF nas mutações: `SameSite` mais verificação do cabeçalho `Origin` contra a lista de origens permitidas.
- 2FA (TOTP), OTP por SMS e SSO (OIDC/SAML, plano Empresarial) são estratégias do contexto `identity-access`.

## 9.11 API pública

- Controllers em `presentation/public-api` de cada contexto, sob o prefixo `/v1`, sobre os mesmos casos de uso da interface.
- Autenticação OAuth 2.0 (client credentials) com âmbitos; limites de pedidos por cliente.
- Especificação OpenAPI gerada pelo `@nestjs/swagger` a partir dos DTO Zod, servida em `/v1/openapi.json`, com Swagger UI em `/v1/docs` (autenticação por cookie ou Bearer). Cada operação tem resumo em português e etiqueta por módulo. Os tipos de `frontend/src/api/types` seguem esta especificação e são actualizados sempre que o contrato muda.
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
- Serviços de suporte: PostgreSQL 16, Redis 7 e MinIO (S3). O `api.pagador.ao/docker-compose.yml` define a pilha completa:
  - `postgres`, `redis`, `minio` (consola em `:9001`);
  - `migrate` — tarefa única: `prisma migrate deploy` e seed;
  - `api` (porta 3333) e `worker`, ambos com a imagem `pagador-api` e as chaves RS256 montadas de `./keys`.
- Em desenvolvimento, `pnpm start:dev` arranca só os serviços de suporte e corre a API em modo *watch*; `docker compose up -d --build` corre tudo em contentores.
- Ambientes: desenvolvimento, QA, pré-produção (dados anonimizados) e produção.
- Alojamento em infra-estrutura com baixa latência para Luanda e conforme as regras de transferência internacional de dados; opção de instalação dedicada para grandes clientes.
- CI/CD por projecto: lint (incluindo fronteiras de camadas), verificação de tipos, análise de dependências e build; na API, `prisma migrate deploy`; deploy automático para QA e produção com aprovação manual.
- A API é sempre publicada antes do frontend quando o contrato muda; alterações incompatíveis exigem nova versão da API pública.
- Feature flags para activar funcionalidades por plano e por cliente.
- Proibição de deploys de risco nos últimos 5 dias úteis de cada mês (período de fecho de folhas).

## 9.14 Fora do âmbito nesta fase

- **Aplicação móvel nativa** (Android/iOS). Consequências: o ponto é registado no navegador; não há registo de ponto offline nem notificações push nativas. Quando a aplicação for desenvolvida, consumirá a mesma API `v1`.
