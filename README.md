# pagador.ao

**pagador.ao** é uma plataforma premium de gestão de folha de pagamento e RH, desenvolvida para simplificar e automatizar o processamento salarial de empresas angolanas. Construído com foco em experiência do usuário, responsividade e performance, o sistema segue os princípios do [Apple Human Interface Guidelines (HIG)](https://developer.apple.com/design/human-interface-guidelines/), suportando tanto modo claro quanto escuro.

## Preview

### Light Mode

![Light Mode Preview](./public/screenshots/light-mode.png)

### Dark Mode

![Dark Mode Preview](./public/screenshots/dark-mode.png)

---

## Funcionalidades

- **Dashboard Gerencial** com gráficos e indicadores de despesas salariais
- **Gestão de Funcionários**
- **Calendário de Pagamentos e Presenças**
- **Controle de Períodos e Métodos de Pagamento**
- **Central de Mensagens e Notificações**
- **Formulários Dinâmicos e Validáveis**
- **Relatórios e Exportações de Dados**
- **Modo Claro e Escuro**
- **Design Responsivo** para desktop, tablet e mobile

---

## Documentação

A documentação funcional e técnica completa (módulos de RH, motor da folha, enquadramento legal angolano, modelo de dados, integrações e roteiro) está em [`docs/`](./docs/README.md).

---

## Tecnologias

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI) + **Hugeicons**
- **Axios** (camada HTTP) + **TanStack Query** (estado de servidor)
- **React Hook Form** + **Zod** (formulários e validação)
- **nuqs** (estado na URL) e **@bentoo/state-man** (estado global)
- **Recharts** (gráficos), **Sonner** (notificações), **next-themes** (modo claro/escuro)

O backend vive no projecto [`api.pagador.ao/`](../api.pagador.ao/) (NestJS). Este projecto é apenas a interface.

---

## Como executar o projecto

```bash
cp .env.example .env   # preencha as variáveis de ambiente
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## Arquitectura

Arquitectura em camadas, organizada em fatias verticais (*vertical slices*) por domínio.

```
src/
├── actions/                # Server Actions do Next.js ("use server"); ver example.ts
├── app/                    # App Router — apenas rotas, sem lógica de negócio
│   ├── layout.tsx          # Layout raiz (Inter, metadata, AppProvider)
│   ├── (public)/
│   │   ├── (auth)/         # login, register, forgot-password (layout em ecrã dividido)
│   │   ├── onboarding/     # Assistente inicial
│   │   └── careers/[company]/
│   ├── (private)/          # Área autenticada (AppShell: sidebar, pesquisa ⌘K, criar)
│   │   ├── page.tsx        # Início (dashboard)
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/       # Ficha do trabalhador
│   │   │   ├── new/        # Admissão em passos
│   │   │   └── _components/
│   │   ├── payroll/[runId]/payslips/[id]/
│   │   └── ...             # Uma pasta por item de src/config/navigation.ts
│   └── (portal)/portal/    # Portal do trabalhador (mobile-first, navegação inferior)
├── api/                    # Camada HTTP (independente do framework)
│   ├── lib/                # Instância Axios, interceptores, gestor de sessão, ApiError
│   ├── services/           # Uma classe de serviço por domínio
│   └── types/              # Tipos de pedido/resposta por domínio
├── components/
│   ├── ui/                 # Primitivas shadcn/ui
│   ├── common/             # Blocos da aplicação: PageHeader, PageTabs, DataTable, StatCard, StatusBadge…
│   ├── charts/             # Gráficos (Recharts) com resumo textual para leitores de ecrã
│   └── payroll/            # Componentes de domínio partilhados por várias rotas
├── config/                 # env (zod), URL da API, constantes e navigation.ts (menu, pesquisa, títulos)
├── hooks/                  # Hooks React partilhados
├── layouts/                # AppShell, AppSidebar, CommandMenu, CreateMenu, AuthLayout, PortalShell
├── lib/                    # cn, formatação (formatKz, formatDate…), cliente do TanStack Query
├── mocks/                  # Dados de demonstração até existirem os endpoints da API
├── providers/              # AppProvider (tema, query, nuqs, toast)
├── queries/                # Hooks TanStack Query por domínio (query.ts / mutation.ts)
├── schemas/                # Esquemas Zod dos formulários por domínio
├── services/               # Serviços de interface (toast, …)
├── stores/                 # Estado global (@bentoo/state-man)
└── middleware.ts           # Middleware do Next.js (por agora sem efeito)
```

### Convenções

- **`actions/`** — Server Actions (`"use server"`) para mutações no servidor. Ver [src/actions/example.ts](src/actions/example.ts): acção validada com zod, pronta para `useActionState` / `<form action={...}>`.
- **`_components`** — componentes usados por uma única rota ficam numa pasta `_components` junto ao `page.tsx`. O sublinhado torna a pasta privada para o router (nunca é uma rota).
- **Grupos de rotas** — `(public)` e `(private)` têm cada um o seu layout.
- **Fatias verticais** — uma funcionalidade percorre `api/types` → `api/services` → `schemas` → `queries` → `_components` da rota. A fatia `auth` serve de referência.
- **Sem regras de negócio na interface** — cálculos, permissões e validações de negócio são da API; a interface apresenta e envia intenções.
- **Sessão** — os tokens ficam em cookies `HttpOnly` definidos pela API; o interceptor do Axios renova a sessão numa resposta 401 e repete o pedido.
- **Navegação** — [src/config/navigation.ts](src/config/navigation.ts) é a única fonte do menu lateral, da pesquisa global e das descrições das páginas. Uma nova página entra aí primeiro.
- **Páginas** — todas seguem o mesmo esqueleto: `PageHeader` (título, pesquisa, acção principal) → `PageTabs` (separadores ligados a `?tab=`) → `PageBody`. Pesquisa e filtros ficam no URL (`?q=`, `?dept=`) via nuqs, para poderem ser partilhados.
- **Dados de demonstração** — `src/mocks` substitui a API enquanto os endpoints não existem. Ao ligar um ecrã à API, troque o import do mock pelo hook de `src/queries/<domínio>`.
- **Design** — tokens de cor em [src/app/globals.css](src/app/globals.css) (claro e escuro), incluindo cores de estado (`success`, `warning`, `info`, `destructive`) e variantes `-strong` para texto sobre fundos coloridos. Cada estado usa `StatusBadge` com texto; a cor nunca é a única pista.
- **Acessibilidade** — alvo WCAG 2.1 AA, verificado com axe em todas as rotas (claro e escuro). Regras: um `<h1>` por página e títulos únicos (`metadata.title`); ícones decorativos com `aria-hidden` e botões só com ícone com `aria-label`; tabelas com `<caption>`; foco visível em todos os controlos; ligação "Saltar para o conteúdo"; `prefers-reduced-motion` respeitado; gráficos com resumo em texto.
- **Ícones** — apenas Hugeicons: `<HugeiconsIcon icon={Search01Icon} className="h-4 w-4" />`, com o componente de `@hugeicons/react` e os ícones de `@hugeicons/core-free-icons`. Em listas de configuração (ex.: sidebar), guarda-se o ícone (`icon: Search01Icon`) e não um componente.
- **Aliases** — `@/*` → `src/*`, `@api/*` → `src/api/*`, `@infra/*` → `src/*`.
- **Ambiente** — variáveis validadas com zod em [src/config/env.ts](src/config/env.ts); valores expostos ao cliente têm o prefixo `NEXT_PUBLIC_`.

---

## Scripts

| Comando      | Descrição                      |
| ------------ | ------------------------------ |
| `pnpm dev`   | Servidor de desenvolvimento    |
| `pnpm build` | Build de produção              |
| `pnpm start` | Servir a aplicação de produção |
| `pnpm lint`  | Executar o ESLint              |

---

## Idioma

Toda a interface do sistema está em **português (pt-BR/AO)**, focando na acessibilidade e compreensão para empresas e colaboradores locais.

---

## Contato

Caso tenha sugestões, feedback ou queira contribuir, entre em contato comigo pelas redes sociais:

- [Facebook](https://www.facebook.com/ikitumba)
- [Instagram](https://www.instagram.com/albertokitumba/)
- [Twitter (X)](https://x.com/TheKitumba)
- [LinkedIn](https://www.linkedin.com/in/albertokitumba/)

---

**pagador.ao** — Feito com ❤️ para empresas que valorizam eficiência e transparência.
