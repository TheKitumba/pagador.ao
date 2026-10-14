# 10 — Mapa de navegação e ecrãs

Coluna **Estado:** *Existe* = ecrã implementado no frontend (com dados de demonstração de `src/mocks` até o endpoint da API existir); *Novo* = rota a criar.

## 10.1 Área pública

| Rota | Ecrã | Estado | Conteúdo |
| --- | --- | --- | --- |
| `/login` | Entrar | Existe | E-mail/telemóvel + palavra-passe, 2FA, "esqueci-me da palavra-passe", SSO |
| `/register` | Criar conta | Existe | Dados do responsável, da empresa (nome, NIF, dimensão, província), aceitação dos termos e da política de privacidade |
| `/forgot-password` | Recuperar acesso | Existe | Envio de ligação ou OTP |
| `/onboarding` | Assistente inicial | Existe | Passos: empresa → estrutura → rubricas → importação de trabalhadores → primeira folha |
| `/careers/[empresa]` | Página de carreiras | Existe | Vagas abertas e formulário de candidatura |

## 10.2 Área autenticada — navegação lateral

### Principal

| Rota | Ecrã | Estado | Conteúdo principal |
| --- | --- | --- | --- |
| `/` | Dashboard | Existe | Indicadores (efectivo, custo da folha do mês, IRT/INSS a pagar, absentismo), gráfico de evolução da despesa salarial, gráfico de descontos e impostos, tarefas pendentes, prazos legais próximos, aniversários |
| `/approvals` | Aprovações | Existe | Caixa única de pedidos pendentes (férias, horas extra, reembolsos, adiantamentos, folha, lotes), aprovar/rejeitar com anulação |
| `/notifications` | Notificações | Existe | Lista filtrável por tipo, marcar como lida, preferências |
| `/employees` | Funcionários | Existe | Lista com pesquisa e filtros, importação, exportação, criação |
| `/employees/[id]` | Ficha do trabalhador | Existe | Separadores: Dados pessoais · Profissional · Contratos · Remuneração · Assiduidade · Férias · Documentos · Desempenho · Formação · Histórico |
| `/employees/new` | Novo trabalhador | Existe | Formulário em passos com validação de BI, NIF e IBAN |
| `/attendance` | Presença | Existe | Painel do dia, marcações, correcções, fecho do período |
| `/payroll` | Folha de pagamento | Existe | Selector de período, lista de processamentos e respectivo estado, tabela de recibos |
| `/payroll/[runId]` | Processamento | Existe | Pré-folha, lançamentos variáveis, cálculo, alertas, comparação com o mês anterior, aprovação, ficheiros bancários |
| `/payroll/[runId]/payslips/[id]` | Recibo | Existe | Detalhe com o rasto de cálculo de cada linha |
| `/invoices` | Faturas | Existe | Facturas de prestadores de serviço (M23) e facturação da subscrição |
| `/performance` | Performance | Existe | Ciclos de avaliação, objectivos, resultados, 9-box |

### Favoritos

| Rota | Ecrã | Estado | Conteúdo |
| --- | --- | --- | --- |
| `/reimbursements` | Reembolsos | Existe | Pedidos de despesa, aprovação, pagamento |
| `/timesheets` | Planilhas de horas | Existe | Registo de horas por projecto, submissão, aprovação |
| `/overtime` | Logs de horas extras | Existe | Pedidos, aprovação, registo legal, limites |

### Outros

| Rota | Ecrã | Estado | Conteúdo |
| --- | --- | --- | --- |
| `/messages` | Mensagens | Existe | Conversas em tempo real, comunicados |
| `/calendar` | Calendário | Existe | Feriados, férias da equipa, pagamentos, prazos fiscais, entrevistas, formações |
| `/feedback` | Feedback | Existe | Feedback contínuo e reconhecimento |
| `/settings` | Configurações | Existe | Empresa, estrutura, rubricas, parâmetros legais, catálogos, fluxos, utilizadores, notificações, subscrição |
| `/help` | Central de ajuda | Existe | Artigos, pesquisa, contacto com o suporte |

### Rotas acrescentadas à navegação

| Rota | Módulo |
| --- | --- |
| `/organization` | M01 — Organograma, unidades, cargos, centros de custo |
| `/contracts` | M04 — Contratos a terminar, períodos experimentais, renovações |
| `/schedules` | M05 — Horários e escalas de turnos |
| `/leave` | M06 — Férias, faltas, licenças e mapa de férias |
| `/payments` | M08 — Lotes de pagamento e reconciliação |
| `/benefits` | M09 — Subsídios, seguros, benefícios |
| `/loans` | M10 — Adiantamentos, empréstimos, penhoras |
| `/recruitment` | M03 — Vagas, candidatos, onboarding |
| `/training` | M13 — Plano de formação, acções, certificados |
| `/disciplinary` | M14 — Processos disciplinares |
| `/safety` | M15 — Exames médicos, acidentes, EPI |
| `/terminations` | M16 — Cessações e acertos de contas |
| `/tax-filings` | M17 — Mapas AGT e INSS, calendário fiscal |
| `/reports` | M21 — Relatórios e análise |
| `/audit` | M25 — Registo de auditoria |

## 10.3 Navegação lateral

A navegação está agrupada por área (definida em `src/config/navigation.ts`, que alimenta também a pesquisa global ⌘K):

```
Principal       Início · Aprovações · Notificações · Mensagens · Calendário
Pessoas         Funcionários · Organização · Contratos · Recrutamento
Tempo           Presença · Escalas · Férias e faltas · Horas extra · Planilhas de horas
Remuneração     Folha de pagamento · Pagamentos · Benefícios · Empréstimos · Reembolsos
Obrigações      Mapas fiscais (AGT/INSS) · Cessações
Desenvolvimento Performance · Feedback · Formação
Gestão          Relatórios · Disciplina · SST · Faturas · Auditoria
Sistema         Aparência · Portal do trabalhador · Configurações · Central de ajuda
```

Os itens visíveis dependem do plano contratado e das permissões do utilizador.

## 10.4 Portal do trabalhador (web responsiva, grupo de rotas `(portal)`)

Implementados em `/portal`, `/portal/payslips`, `/portal/time`, `/portal/requests` e `/portal/profile`, com navegação inferior no telemóvel. Escala, Desempenho, Formação e Equipa ficam por implementar.

| Ecrã | Conteúdo |
| --- | --- |
| Início | Próximo pagamento, saldo de férias, marcar ponto, avisos |
| Recibos | Lista por mês, descarregar PDF |
| Ponto | Marcar entrada/saída, histórico, estado da sincronização |
| Pedidos | Férias, faltas, adiantamentos, reembolsos, declarações, estado de cada pedido |
| Escala | Turnos da semana/mês, trocas |
| Desempenho | Objectivos, auto-avaliação, feedback |
| Formação | Inscrições e certificados |
| Perfil | Dados pessoais, dependentes, conta bancária, documentos |
| Equipa (chefias) | Aprovações pendentes, presença da equipa, calendário de férias |
