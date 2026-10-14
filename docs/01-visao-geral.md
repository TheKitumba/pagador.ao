# 01 — Visão geral do produto

## 1.1 Missão

Dar a qualquer empresa angolana — da cantina de bairro ao grupo empresarial com milhares de trabalhadores — uma ferramenta única, fiável e em conformidade com a lei para gerir todo o ciclo de vida do trabalhador: do recrutamento à cessação do contrato, com a folha de pagamento processada correctamente, a tempo e sem papel.

## 1.2 Problema

As empresas em Angola enfrentam, de forma recorrente:

- **Processamento salarial manual** em folhas de cálculo, com erros no IRT, na Segurança Social e nos subsídios.
- **Alterações legislativas frequentes** (OGE anual, nova Lei Geral do Trabalho, actualizações do salário mínimo) difíceis de acompanhar.
- **Obrigações declarativas dispersas** (AGT, INSS, Inspecção Geral do Trabalho) com prazos curtos e multas elevadas.
- **Dossiês de trabalhadores em papel**, perdidos ou incompletos.
- **Controlo de assiduidade frágil**, sobretudo em empresas com várias instalações ou trabalho por turnos.
- **Pagamentos bancários morosos**, introduzidos um a um no internet banking.
- **Pouca visibilidade** sobre custos com pessoal, absentismo e rotatividade.

## 1.3 Proposta de valor

| Para quem | O que ganha |
| --- | --- |
| Dono / Direcção | Custo total com pessoal em tempo real, previsões, conformidade legal garantida |
| Departamento de RH | Processos digitais, dossiê único do trabalhador, menos tarefas repetitivas |
| Contabilidade / Finanças | Folha calculada automaticamente, mapas fiscais prontos, exportação contabilística |
| Chefias | Aprovação de férias, faltas e horas extra no telemóvel |
| Trabalhador | Portal self-service: recibos, férias, declarações, actualização de dados |

## 1.4 Público-alvo

Todas as empresas e organizações que empregam trabalhadores em Angola, de qualquer dimensão e sector.

### 1.4.1 Segmentos por dimensão

A classificação segue a Lei das Micro, Pequenas e Médias Empresas (Lei n.º 30/11, de 13 de Setembro), em vigor à data. O sistema deve permitir actualizar estes critérios.

| Segmento | Trabalhadores | Necessidades típicas | Funcionalidades em destaque |
| --- | --- | --- | --- |
| Micro | 1 a 10 | Simplicidade, preço baixo, recibos e IRT correctos | Assistente de configuração, folha simplificada, recibos via WhatsApp/e-mail |
| Pequena | 11 a 100 | Assiduidade, férias, pagamentos em lote | Ponto electrónico, ficheiros bancários, portal do trabalhador |
| Média | 101 a 200 | Vários departamentos, aprovações, relatórios | Workflows, centros de custo, avaliação de desempenho |
| Grande | Mais de 200 | Multi-empresa, multi-província, integrações | Grupos empresariais, API, SSO, auditoria avançada, ERP |

### 1.4.2 Sectores com requisitos específicos

| Sector | Particularidades suportadas |
| --- | --- |
| Petróleo e gás | Regime de rotação (ex.: 28/28), subsídio de isolamento, trabalhadores expatriados, pagamentos em moeda estrangeira com conversão |
| Construção civil | Trabalhadores temporários e por obra, alocação a projectos, elevada rotatividade |
| Comércio e retalho | Turnos, trabalho ao fim-de-semana e feriados, várias lojas |
| Banca e seguros | Elevada exigência de auditoria e segregação de funções |
| Saúde | Escalas de serviço, horas nocturnas, piquetes |
| Segurança privada | Escalas 12h/24h, postos de trabalho em clientes, horas nocturnas |
| Agricultura e agro-indústria | Trabalho sazonal, pagamento à jorna, trabalhadores sem conta bancária |
| Educação | Contratos por ano lectivo, carga horária docente |
| Hotelaria e restauração | Turnos, gorjetas, alimentação em espécie |
| ONG e organismos internacionais | Financiamento por projecto/doador, relatórios por fonte de financiamento |
| Administração pública e empresas públicas | Carreiras e escalões, tabelas salariais por categoria |

### 1.4.3 Abrangência geográfica

O sistema deve suportar as **21 províncias** da divisão político-administrativa em vigor (Lei n.º 14/24): Bengo, Benguela, Bié, Cabinda, Cuando, Cubango, Cuanza Norte, Cuanza Sul, Cunene, Huambo, Huíla, Icolo e Bengo, Luanda, Lunda Norte, Lunda Sul, Malanje, Moxico, Moxico Leste, Namibe, Uíge e Zaire, com os respectivos municípios. A lista deve ser uma tabela de referência actualizável.

## 1.5 Utilizadores do sistema

| Perfil | Descrição |
| --- | --- |
| Administrador da conta | Responsável pela subscrição, empresas, utilizadores e configurações globais |
| Gestor de RH | Gere trabalhadores, contratos, férias, assiduidade, formação, avaliação |
| Processador salarial | Prepara, calcula, valida e fecha a folha de pagamento |
| Director financeiro / Aprovador | Aprova a folha e os pagamentos, consulta custos |
| Chefia directa | Aprova pedidos da equipa, consulta assiduidade e avalia desempenho |
| Trabalhador | Acede ao portal self-service |
| Recrutador | Gere vagas, candidatos e entrevistas |
| Auditor / Contabilista externo | Acesso apenas de leitura a mapas, relatórios e registo de auditoria |

O detalhe das permissões está em [05 — Perfis e permissões](./05-perfis-e-permissoes.md).

## 1.6 Princípios do produto

1. **Conformidade por omissão.** As regras legais angolanas vêm pré-configuradas; o utilizador não precisa de ser especialista em fiscalidade.
2. **Parametrizável, nunca codificado.** Taxas, escalões, subsídios e feriados são dados com data de vigência, não código.
3. **Rastreabilidade total.** Qualquer valor da folha pode ser explicado: de onde veio, quem o alterou e quando.
4. **Pensado primeiro para o telemóvel, no navegador.** Trabalhadores e chefias usam sobretudo o telemóvel, e a ligação à internet pode ser instável; o portal é uma aplicação web responsiva e leve (a aplicação móvel nativa fica para uma fase posterior).
5. **Simples para a micro empresa, poderoso para o grupo.** As funcionalidades avançadas activam-se por plano e por configuração, sem complicar a experiência base.
6. **Design consistente.** Segue as Human Interface Guidelines da Apple, com modo claro e escuro, tipografia Nunito e componentes acessíveis.

## 1.7 Planos comerciais (proposta)

| Funcionalidade | Essencial | Profissional | Empresarial |
| --- | --- | --- | --- |
| Gestão de trabalhadores e contratos | Sim | Sim | Sim |
| Folha de pagamento, IRT e INSS | Sim | Sim | Sim |
| Recibos digitais | Sim | Sim | Sim |
| Mapas AGT / INSS | Sim | Sim | Sim |
| Férias, faltas e licenças | Sim | Sim | Sim |
| Portal do trabalhador | Básico | Completo | Completo |
| Ponto electrónico e escalas | — | Sim | Sim |
| Ficheiros bancários em lote | — | Sim | Sim |
| Recrutamento | — | Sim | Sim |
| Avaliação de desempenho e formação | — | Sim | Sim |
| Workflows de aprovação personalizados | — | Básico | Avançado |
| Multi-empresa / grupo empresarial | — | — | Sim |
| API, webhooks e SSO | — | — | Sim |
| Integração com ERP | — | — | Sim |
| Suporte | E-mail | E-mail e telefone | Gestor de conta dedicado |

O preço deveria ser por trabalhador activo por mês, em Kwanzas, com desconto no pagamento anual.

## 1.8 Indicadores de sucesso do produto

- Tempo médio de processamento de uma folha mensal (meta: menos de 30 minutos para 100 trabalhadores).
- Percentagem de folhas fechadas sem correcções posteriores.
- Percentagem de trabalhadores com acesso activo ao portal.
- Cumprimento dos prazos declarativos (AGT e INSS) pelos clientes.
- Taxa de retenção mensal de clientes e NPS.
