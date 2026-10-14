# 11 — Roteiro de entregas

As fases estão ordenadas por valor para o cliente e por dependências técnicas. As durações são estimativas indicativas para uma equipa de 4 a 6 pessoas.

## Fase 0 — Fundações (4–6 semanas)

- Autenticação, contas, multi-inquilino, papéis e permissões base.
- Estrutura de empresa, estabelecimentos e departamentos.
- Tabelas de referência (províncias, municípios, bancos) e **tabelas legais versionadas**.
- Registo de auditoria.
- Design system (componentes, modo claro/escuro, formatação `pt-AO`).
- API NestJS em `api.pagador.ao/` com a estrutura de contextos delimitados (DDD), Prisma + PostgreSQL com RLS, autenticação por JWT em cookie, worker com BullMQ e Redis, armazenamento de ficheiros (ver [09](./09-arquitectura-tecnica.md)).
- Frontend Next.js em `frontend/` com a arquitectura em fatias verticais (`api/` com Axios, `queries/` com TanStack Query, `schemas/`, `_components/` por rota).
- Pipeline de CI/CD e ambientes (imagens Docker `pagador-web` e `pagador-api`).

## Fase 1 — MVP: folha de pagamento em conformidade (10–12 semanas)

Objectivo: uma pequena empresa angolana consegue processar e pagar salários, e cumprir as obrigações AGT e INSS, sem folhas de cálculo.

- M02 — Trabalhadores (dados essenciais, documentos, importação Excel).
- M04 — Contratos (tipos principais, alertas de fim de termo).
- M07 — Folha mensal: rubricas pré-configuradas, IRT Grupo A, Segurança Social, faltas, horas extra lançadas manualmente, subsídios de férias e de Natal.
- Recibos em PDF e envio por e-mail.
- M08 — Ficheiros bancários para os 5 maiores bancos.
- M17 — Mapas de IRT e folha de remunerações do INSS.
- Dashboard com custo da folha e impostos.
- Assistente de configuração inicial.
- **Critério de saída:** 10 empresas-piloto processam 3 meses consecutivos com resultados validados por técnico de contas.

## Fase 2 — Tempo e self-service (8–10 semanas)

- M05 — Horários, ponto no navegador (computador e telemóvel, com geolocalização), quiosque, horas extra com aprovação, fecho de período.
- M06 — Férias, faltas e licenças com saldos e mapa de férias.
- M18 — Portal do trabalhador web responsivo (recibos, pedidos, perfil).
- Motor de fluxos de aprovação.
- M19 — Notificações por e-mail e SMS, mensagens.
- M16 — Cessação com acerto final de contas.
- M10 — Adiantamentos e empréstimos.

## Fase 3 — Crescimento e gestão de talento (10–12 semanas)

- M03 — Recrutamento e onboarding.
- M12 — Avaliação de desempenho e feedback.
- M13 — Formação.
- M11 — Reembolsos e ajudas de custo.
- M09 — Benefícios e seguros.
- M21 — Construtor de relatórios e indicadores de RH.
- Escalas de turnos e regimes de rotação.
- Integração com terminais biométricos.
- Restantes bancos e formato EMIS.

## Fase 4 — Empresarial (contínua)

- Multi-empresa / grupos empresariais e consolidação.
- API pública, webhooks, SSO e SCIM.
- Conectores ERP e exportação contabilística avançada.
- M22 — Expatriados, moeda estrangeira e cálculo inverso.
- M14 — Disciplina; M15 — SST.
- Tabelas salariais por carreiras (sector público).
- Orçamento e previsão de custos com pessoal.
- Idioma inglês.
- WhatsApp Business.

## Fora do âmbito (por agora)

- **Aplicação móvel nativa** (Android e iOS), incluindo ponto offline e notificações push nativas. Quando for retomada, consumirá a API `v1` já existente; nenhuma parte do backend terá de ser refeita.

## Actividade permanente

- **Monitorização legislativa:** acompanhar o Diário da República, o OGE anual, comunicados da AGT e do INSS; publicar novas versões das tabelas legais com antecedência e comunicar aos clientes.
- Validação dos casos de referência do motor de cálculo por técnico de contas parceiro.
- Recolha de feedback das empresas-piloto e priorização trimestral.

## Riscos principais

| Risco | Mitigação |
| --- | --- |
| Alteração legislativa súbita (ex.: OGE) | Tabelas legais versionadas; publicação central; reprocessamento |
| Formatos de ficheiro de bancos/AGT/INSS mudam sem aviso | Catálogo de formatos configurável; parcerias directas com bancos |
| Erros de cálculo com impacto fiscal | Casos de referência validados por técnico de contas; pré-folha; comparação mês a mês; aprovação dupla |
| Conectividade fraca no terreno | Páginas leves; envios idempotentes; quiosque no estabelecimento; SMS como canal alternativo; ponto offline na futura aplicação móvel |
| Resistência à mudança (folhas de cálculo) | Assistente de migração; formação; suporte na primeira folha |
| Fraude interna (alteração de IBAN, trabalhadores fantasma) | Segregação de funções; alertas; validação de dados bancários; auditoria |
