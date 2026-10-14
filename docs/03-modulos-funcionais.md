# 03 — Módulos funcionais

Este documento descreve cada módulo do sistema: objectivo, funcionalidades, regras de negócio e saídas. Os identificadores (`RF-XX-NN`) permitem rastrear requisitos até às tarefas de desenvolvimento.

## Mapa de módulos

```
                         ┌──────────────────────────────┐
                         │  M01 Organização e estrutura │
                         └──────────────┬───────────────┘
         ┌──────────────────┬───────────┼────────────┬──────────────────┐
┌────────▼───────┐ ┌────────▼───────┐ ┌─▼──────────┐ ┌▼───────────────┐ ┌▼────────────────┐
│ M03 Recrutam.  │→│ M02 Trabalhador│→│ M04 Contrat│ │ M05 Assiduidade│ │ M06 Férias,     │
│ e admissão     │ │ (dossiê)       │ │ os         │ │ e tempo        │ │ faltas, licenças│
└────────────────┘ └────────┬───────┘ └─┬──────────┘ └┬───────────────┘ └┬────────────────┘
                            └───────────┴──────┬──────┴──────────────────┘
                                     ┌─────────▼──────────┐
                                     │ M07 Folha de       │──→ M08 Pagamentos ──→ Bancos
                                     │ pagamento          │──→ M17 Obrigações fiscais ──→ AGT / INSS
                                     └─────────┬──────────┘──→ Contabilidade
                                               │
   M09 Benefícios · M10 Adiantamentos/empréstimos · M11 Reembolsos · M12 Desempenho
   M13 Formação · M14 Disciplina · M15 SST · M16 Cessação · M18 Portal do trabalhador
   M19 Comunicação · M20 Documentos · M21 Relatórios · M22 Expatriados · M23 Prestadores
   M24 Configurações · M25 Auditoria
```

---

## M01 — Organização e estrutura

**Objectivo:** modelar a estrutura da entidade empregadora, desde o grupo empresarial até ao posto de trabalho.

| ID | Requisito |
| --- | --- |
| RF-01-01 | Registar **grupos empresariais** com várias **empresas** (cada uma com NIF, número de contribuinte do INSS, alvará, CAE/actividade, morada fiscal, logótipo, capital social). |
| RF-01-02 | Registar **estabelecimentos** (sede, filiais, lojas, obras, plataformas) por empresa, com província, município e endereço. |
| RF-01-03 | Criar a **estrutura orgânica** hierárquica: direcções, departamentos, secções e equipas, com responsável. Visualizar como organograma interactivo. |
| RF-01-04 | Gerir **centros de custo** e **projectos** (incluindo fonte de financiamento para ONG) e permitir a repartição percentual do custo de um trabalhador por vários centros. |
| RF-01-05 | Gerir o **catálogo de cargos/funções** com descrição de funções, requisitos, competências e cargo hierárquico superior. |
| RF-01-06 | Gerir **categorias profissionais** e **carreiras**, com **tabelas salariais** por categoria, classe e escalão (essencial para empresas públicas e convenções colectivas). |
| RF-01-07 | Definir o **quadro de pessoal** previsto (vagas orçamentadas por departamento) e comparar com o efectivo real. |
| RF-01-08 | Registar **convenções colectivas** e regulamentos internos que alterem valores legais por omissão. |
| RF-01-09 | Manter o histórico de todas as alterações estruturais com data de efeito (o organograma de qualquer data passada deve poder ser reconstituído). |

---

## M02 — Gestão de trabalhadores (dossiê digital)

**Objectivo:** ser a fonte única de verdade sobre cada trabalhador. Rota actual: `/employees`.

### Dados do trabalhador

| Grupo | Campos |
| --- | --- |
| Identificação | Nome completo, nome profissional, fotografia, sexo, data de nascimento, estado civil, nacionalidade, naturalidade (província/município) |
| Documentos | Bilhete de Identidade (número, emissão, validade, local de emissão), NIF, n.º de Segurança Social, passaporte, cartão de residente, visto de trabalho (para estrangeiros), carta de condução |
| Contactos | Telemóvel principal e alternativo (formato `+244 9XX XXX XXX`), e-mail pessoal, morada (província, município, bairro, rua, casa), contacto de emergência |
| Agregado familiar | Cônjuge, dependentes (nome, data de nascimento, grau de parentesco, documento) — utilizado no abono de família e nos seguros |
| Habilitações | Grau académico, curso, instituição, ano de conclusão, certificados digitalizados |
| Experiência | Empregos anteriores, competências, línguas |
| Dados bancários | Banco, IBAN, titular; suporte para mais de uma conta e percentagem de repartição; indicação de pagamento em numerário |
| Dados profissionais | N.º mecanográfico, data de admissão, antiguidade (calculada), empresa, estabelecimento, departamento, cargo, categoria, chefia directa, centro de custo, tipo de horário, situação (activo, suspenso, em licença, cessado) |
| Saúde | Grupo sanguíneo, deficiência e grau, aptidão médica (com acesso restrito) |
| Fardamento e equipamento | Tamanhos, equipamentos atribuídos (portátil, telemóvel, viatura, EPI) |

### Requisitos

| ID | Requisito |
| --- | --- |
| RF-02-01 | Criar, editar, consultar e arquivar trabalhadores, com validação de campos (BI, NIF, IBAN, telemóvel). |
| RF-02-02 | Detectar duplicados por BI, NIF ou n.º de Segurança Social. |
| RF-02-03 | Manter **histórico com data de efeito** de cada alteração relevante (cargo, salário, departamento, morada, dados bancários). |
| RF-02-04 | Anexar documentos digitalizados ao dossiê, organizados por tipo, com data de validade e alertas de expiração (BI, visto, cartão de residente, certificados). |
| RF-02-05 | Importar trabalhadores em massa a partir de Excel/CSV com modelo descarregável, pré-validação e relatório de erros. |
| RF-02-06 | Pesquisa global e filtros por qualquer atributo; vistas guardadas; exportação da lista. |
| RF-02-07 | Ficha resumo do trabalhador em PDF. |
| RF-02-08 | Linha temporal do trabalhador: admissão, promoções, alterações salariais, férias, avaliações, acções disciplinares, formação. |
| RF-02-09 | Acesso aos dados sensíveis (saúde, salário, dados bancários) restrito por permissão específica e registado na auditoria. |
| RF-02-10 | Alterações de dados bancários feitas pelo trabalhador exigem validação pelo RH (protecção contra fraude). |

---

## M03 — Recrutamento, selecção e admissão

| ID | Requisito |
| --- | --- |
| RF-03-01 | **Requisição de pessoal** pela chefia, com justificação, cargo, orçamento e aprovação (ligada ao quadro de pessoal). |
| RF-03-02 | Publicação de **vagas** numa página de carreiras da empresa e partilha em redes sociais e portais de emprego. |
| RF-03-03 | Formulário de candidatura com upload de CV e perguntas de triagem. |
| RF-03-04 | **Pipeline de candidatos** em quadro Kanban (Candidatura → Triagem → Entrevista → Teste → Proposta → Contratado / Rejeitado). |
| RF-03-05 | Agendamento de entrevistas integrado com o calendário, com convites por e-mail/SMS. |
| RF-03-06 | Fichas de avaliação de entrevista e pontuação. |
| RF-03-07 | Geração da **carta-proposta** a partir de modelo. |
| RF-03-08 | Conversão do candidato em trabalhador sem nova introdução de dados. |
| RF-03-09 | **Onboarding:** lista de tarefas de acolhimento (documentos a entregar, inscrição no INSS, exame médico, equipamento, contas de acesso, formação inicial), com responsáveis e prazos. |
| RF-03-10 | Banco de talentos com consentimento do candidato para conservação dos dados (Lei n.º 22/11). |

---

## M04 — Contratos de trabalho

| ID | Requisito |
| --- | --- |
| RF-04-01 | Registar contratos de todas as modalidades previstas na LGT (ver [02](./02-enquadramento-legal.md#221-contrato-de-trabalho)). |
| RF-04-02 | Gerar o contrato em PDF/Word a partir de **modelos com variáveis** (`{{trabalhador.nome}}`, `{{contrato.salario_base}}`, etc.). |
| RF-04-03 | Assinatura electrónica do contrato (trabalhador e representante da empresa), com registo de data, hora e IP. |
| RF-04-04 | Controlo do **período experimental**: data de fim, alerta prévio, registo de confirmação ou denúncia. |
| RF-04-05 | Controlo de **contratos a termo**: data de fim, renovações, limites legais, alertas (60, 30 e 15 dias antes) e sugestão de renovação, conversão ou caducidade. |
| RF-04-06 | **Adendas** contratuais (alteração de salário, função, horário, local), com histórico. |
| RF-04-07 | Validação do salário base face ao salário mínimo e à tabela salarial da categoria. |
| RF-04-08 | Contratos de **não residentes** com dados do visto, duração autorizada e moeda de referência. |

---

## M05 — Assiduidade, horários e tempo de trabalho

Rotas actuais: `/attendance`, `/timesheets`, `/overtime`, `/calendar`.

### 5.1 Horários e escalas

| ID | Requisito |
| --- | --- |
| RF-05-01 | Definir **horários** fixos, flexíveis, por turnos, a tempo parcial e regimes de rotação (ex.: 28/28). |
| RF-05-02 | Construir **escalas de turnos** mensais por equipa, com arrastar-e-largar, detecção de conflitos (descanso mínimo, limite de horas) e publicação aos trabalhadores. |
| RF-05-03 | Pedidos de troca de turno entre trabalhadores, com aprovação da chefia. |
| RF-05-04 | Calendário de **feriados** nacionais (pré-carregado), municipais e da empresa; regras de "ponte". |

### 5.2 Registo de presença (ponto)

| ID | Requisito |
| --- | --- |
| RF-05-05 | Registo de entrada/saída por: navegador no computador ou no telemóvel (com **geolocalização** e geocerca por estabelecimento), quiosque com PIN/QR code, e terminais **biométricos** (impressão digital, reconhecimento facial) via integração. |
| RF-05-06 | *Fora do âmbito nesta fase:* registo de ponto **offline**, que depende da futura aplicação móvel nativa. No navegador, uma marcação sem rede é recusada com mensagem clara, e o trabalhador pode usar o quiosque ou pedir correcção à chefia. |
| RF-05-07 | Fotografia opcional no momento da marcação (prevenção de fraude), com consentimento. |
| RF-05-08 | Cálculo automático de: horas trabalhadas, atrasos, saídas antecipadas, faltas, horas nocturnas, horas em dia de descanso e em feriado, horas extra. |
| RF-05-09 | Tolerâncias configuráveis (ex.: 10 minutos de atraso). |
| RF-05-10 | Painel diário de presença: presentes, ausentes, atrasados, de férias, de baixa, por estabelecimento. |
| RF-05-11 | Correcção manual de marcações com justificação obrigatória e registo de auditoria. |

### 5.3 Folhas de horas (timesheets)

| ID | Requisito |
| --- | --- |
| RF-05-12 | Registo de horas por projecto/tarefa/cliente (consultoras, construção, ONG). |
| RF-05-13 | Submissão semanal ou mensal e aprovação pela chefia ou gestor de projecto. |
| RF-05-14 | Imputação do custo das horas aos projectos e centros de custo. |

### 5.4 Horas extraordinárias

| ID | Requisito |
| --- | --- |
| RF-05-15 | Pedido prévio de horas extra pela chefia ou trabalhador, com aprovação. |
| RF-05-16 | Classificação automática das horas extra por tipo (dia útil, descanso semanal, feriado, nocturno) e por escalão de acréscimo. |
| RF-05-17 | Bloqueio ou alerta ao exceder limites diários, mensais e anuais. |
| RF-05-18 | **Registo de horas extraordinárias** legal, exportável para a IGT. |
| RF-05-19 | Envio automático das horas aprovadas para a folha do período. |
| RF-05-20 | Opção de **banco de horas** quando previsto em convenção ou acordo. |

### 5.5 Fecho do período de assiduidade

Antes do processamento salarial, o RH **fecha o período de assiduidade**: as faltas, atrasos e horas extra aprovados passam para a folha; alterações posteriores tornam-se ajustes no período seguinte.

---

## M06 — Férias, faltas e licenças

| ID | Requisito |
| --- | --- |
| RF-06-01 | Cálculo automático do **direito a férias** por trabalhador (22 dias úteis por omissão, regras do ano de admissão, acréscimos por convenção). |
| RF-06-02 | Saldos visíveis em tempo real: dias vencidos, gozados, marcados, por gozar e transitados. |
| RF-06-03 | Pedido de férias no portal ou na aplicação, com visualização dos colegas da equipa já ausentes. |
| RF-06-04 | Fluxo de aprovação configurável (chefia → RH). |
| RF-06-05 | **Mapa de férias** anual por departamento, exportável e afixável. |
| RF-06-06 | Pagamento do **subsídio de férias** na folha, no mês definido (mês anterior ao gozo, mês fixo da empresa ou mês de aniversário da admissão). |
| RF-06-07 | Registo de **faltas** com catálogo de motivos (justificada/injustificada, com/sem perda de remuneração, documento exigido). |
| RF-06-08 | Upload de justificativos (atestado médico, certidão de óbito, etc.) com prazo para entrega e alerta. |
| RF-06-09 | **Licenças:** maternidade, paternidade, sem vencimento, para estudos, doença prolongada, acidente de trabalho; com efeito automático na folha (suspensão ou redução de rubricas). |
| RF-06-10 | Controlo de baixas pagas pela Segurança Social versus pela empresa. |
| RF-06-11 | Indicadores de **absentismo** por trabalhador, departamento e motivo. |

---

## M07 — Folha de pagamento

Rota actual: `/payroll`. O detalhe do motor de cálculo está em [04 — Motor da folha de pagamento](./04-folha-de-pagamento.md).

| ID | Requisito |
| --- | --- |
| RF-07-01 | Processar folhas **mensais** (padrão) e também **quinzenais, semanais ou à jorna** (agricultura, construção). |
| RF-07-02 | Processamentos **especiais**: subsídio de férias, subsídio de Natal, prémios/bónus, retroactivos, acerto final de contas, folha complementar. |
| RF-07-03 | Cálculo automático de vencimentos, subsídios, horas extra, faltas, IRT, Segurança Social e outros descontos. |
| RF-07-04 | Simulação ("pré-folha") antes do cálculo definitivo, com comparação face ao mês anterior e destaque de variações relevantes. |
| RF-07-05 | **Fluxo de estados:** Rascunho → Calculada → Em revisão → Aprovada → Paga → Fechada. Uma folha fechada não pode ser alterada; as correcções fazem-se no período seguinte ou por folha complementar. |
| RF-07-06 | Lançamentos variáveis em massa (importação de Excel, grelha editável). |
| RF-07-07 | **Recibo de vencimento** detalhado em PDF, enviado por e-mail, disponível no portal e opcionalmente notificado por SMS/WhatsApp. |
| RF-07-08 | Cálculo inverso **líquido → ilíquido** (útil para expatriados e propostas de contratação). |
| RF-07-09 | Suporte a **pagamento em moeda estrangeira** (USD/EUR) com conversão à taxa de câmbio do BNA na data definida e tributação em Kwanzas. |
| RF-07-10 | Mapa de **custo total com pessoal** (salários + encargos da entidade empregadora + seguros + benefícios). |
| RF-07-11 | Reprocessamento de períodos anteriores com as tabelas legais em vigor nesse período. |

---

## M08 — Pagamentos

| ID | Requisito |
| --- | --- |
| RF-08-01 | Geração de **ficheiros de transferência em lote** nos formatos aceites pelos principais bancos angolanos (BAI, BFA, BIC, BPC, Banco Millennium Atlântico, Standard Bank Angola, Banco Sol, Banco Keve, Banco Económico, Banco Yetu, Banco Caixa Geral Angola, entre outros) e no formato interbancário da EMIS. |
| RF-08-02 | Repartição do líquido por várias contas do trabalhador. |
| RF-08-03 | Pagamento em **numerário**: listagem de envelopes com nota de quebra de moeda e recibo de entrega assinado. |
| RF-08-04 | Pagamento por **carteiras móveis** (ex.: Unitel Money, Multicaixa Express) quando o cliente as utilize. |
| RF-08-05 | Aprovação do lote de pagamento com dupla validação (quem prepara não pode aprovar). |
| RF-08-06 | Registo de pagamentos rejeitados (IBAN inválido, conta fechada) e reemissão. |
| RF-08-07 | Reconciliação com o extracto bancário importado. |
| RF-08-08 | Pagamento das guias de IRT e Segurança Social (referências de pagamento). |

---

## M09 — Benefícios e subsídios

| ID | Requisito |
| --- | --- |
| RF-09-01 | Catálogo de subsídios: alimentação, transporte, habitação, isolamento, risco, turno, chefia, representação, comunicações, abono de família, entre outros, cada um ligado a uma rubrica de folha. |
| RF-09-02 | Atribuição por trabalhador, cargo, categoria ou estabelecimento, com regras (valor fixo, percentagem do salário base, por dia trabalhado). |
| RF-09-03 | Gestão de **seguro de saúde** (seguradora, plano, beneficiários, custo para a empresa e comparticipação do trabalhador). |
| RF-09-04 | Gestão do **seguro de acidentes de trabalho** (apólice, massa salarial declarada). |
| RF-09-05 | Benefícios em espécie (viatura, habitação, telemóvel) com valorização fiscal. |
| RF-09-06 | Planos de pensões complementares, quando existam. |

---

## M10 — Adiantamentos, empréstimos e penhoras

| ID | Requisito |
| --- | --- |
| RF-10-01 | Pedido de **adiantamento salarial** no portal, com limite configurável (ex.: até 30% do líquido) e aprovação. |
| RF-10-02 | **Empréstimos** ao trabalhador com plano de amortização em prestações, descontadas automaticamente na folha. |
| RF-10-03 | Registo de **penhoras judiciais** e descontos obrigatórios por ordem de terceiros, respeitando os limites legais de impenhorabilidade. |
| RF-10-04 | Quotas sindicais e outros descontos autorizados pelo trabalhador. |
| RF-10-05 | Na cessação, liquidação automática dos saldos em dívida no acerto de contas. |

---

## M11 — Reembolsos de despesas

Rota actual: `/reimbursements`.

| ID | Requisito |
| --- | --- |
| RF-11-01 | Submissão de despesas (deslocações, refeições, combustível, material) com fotografia do recibo/factura. |
| RF-11-02 | Categorias de despesa com limites por cargo. |
| RF-11-03 | Gestão de **ajudas de custo** em deslocação (nacional e internacional), com tabelas por destino e cargo. |
| RF-11-04 | Aprovação pela chefia e validação pelas finanças. |
| RF-11-05 | Pagamento pela folha (rubrica não sujeita) ou por transferência separada. |

---

## M12 — Gestão do desempenho

Rotas actuais: `/performance`, `/feedback`.

| ID | Requisito |
| --- | --- |
| RF-12-01 | Ciclos de avaliação configuráveis (anual, semestral, trimestral). |
| RF-12-02 | Definição de **objectivos** individuais e de equipa (OKR ou SMART), alinhados com os objectivos da empresa. |
| RF-12-03 | Avaliação por competências com escalas configuráveis. |
| RF-12-04 | Modelos de avaliação: auto-avaliação, chefia, 180° e 360°. |
| RF-12-05 | Feedback contínuo e reconhecimento entre colegas. |
| RF-12-06 | Reuniões individuais (one-on-one) com registo de notas. |
| RF-12-07 | Calibração de resultados por comité e matriz 9-box. |
| RF-12-08 | Ligação aos **prémios de desempenho** (cálculo e envio para a folha) e às promoções. |
| RF-12-09 | Planos de desenvolvimento individual (PDI). |

---

## M13 — Formação e desenvolvimento

| ID | Requisito |
| --- | --- |
| RF-13-01 | Levantamento de necessidades de formação a partir das avaliações e dos cargos. |
| RF-13-02 | Plano anual de formação e orçamento. |
| RF-13-03 | Catálogo de acções (internas, externas, e-learning), formadores e entidades formadoras. |
| RF-13-04 | Inscrições, presenças, avaliação da formação e emissão de certificados. |
| RF-13-05 | Matriz de competências e certificações obrigatórias por cargo, com alertas de expiração (ex.: certificados de segurança no sector petrolífero). |
| RF-13-06 | Relatórios de horas de formação por trabalhador e custo por acção. |
| RF-13-07 | Planos de **angolanização** de quadros: substituição progressiva de expatriados por quadros nacionais, com metas e acompanhamento. |

---

## M14 — Disciplina

| ID | Requisito |
| --- | --- |
| RF-14-01 | Registo de ocorrências e infracções disciplinares. |
| RF-14-02 | Tramitação do **processo disciplinar** conforme a LGT: nota de culpa, prazo de resposta, audiência, decisão, com controlo de prazos legais (incluindo prescrição e caducidade do procedimento). |
| RF-14-03 | Modelos de documentos (nota de culpa, convocatória, decisão). |
| RF-14-04 | Registo das medidas aplicadas (advertência, repreensão, despromoção, perda de dias de férias, multa, suspensão, despedimento) e efeito na folha quando aplicável. |
| RF-14-05 | Acesso restrito e confidencial. |

---

## M15 — Saúde e segurança no trabalho (SST)

| ID | Requisito |
| --- | --- |
| RF-15-01 | Exames médicos de admissão, periódicos e de regresso, com resultado de aptidão e alertas de renovação. |
| RF-15-02 | Registo de **acidentes de trabalho** e doenças profissionais, participação à seguradora e acompanhamento da baixa. |
| RF-15-03 | Entrega de **equipamento de protecção individual (EPI)** com termo de responsabilidade. |
| RF-15-04 | Avaliação de riscos por posto de trabalho. |
| RF-15-05 | Indicadores: taxa de frequência, taxa de gravidade, dias sem acidentes. |

---

## M16 — Cessação do contrato (offboarding)

| ID | Requisito |
| --- | --- |
| RF-16-01 | Iniciar a cessação seleccionando o motivo (ver [02](./02-enquadramento-legal.md#228-cessação-do-contrato)). |
| RF-16-02 | Alertas de protecção legal (gravidez, licença de maternidade, representante sindical, baixa por acidente). |
| RF-16-03 | Controlo do **aviso prévio** (dias, cumprimento ou compensação). |
| RF-16-04 | Cálculo automático do **acerto final de contas** (proporcionais, indemnização, compensação, descontos de empréstimos e adiantamentos), com detalhe de cada linha. |
| RF-16-05 | Lista de tarefas de saída: devolução de equipamento, revogação de acessos, entrevista de saída, comunicação ao INSS. |
| RF-16-06 | Emissão do **certificado de trabalho** e da declaração de rendimentos do ano. |
| RF-16-07 | Questionário de saída e análise de motivos de rotatividade. |
| RF-16-08 | Possibilidade de readmissão mantendo o histórico anterior. |

---

## M17 — Obrigações fiscais e contributivas

| ID | Requisito |
| --- | --- |
| RF-17-01 | Mapa mensal de **retenções de IRT** por trabalhador. |
| RF-17-02 | Ficheiro de **declaração de remunerações** no formato exigido pela AGT. |
| RF-17-03 | **Folha de remunerações do INSS** no formato do portal da Segurança Social. |
| RF-17-04 | **Declaração anual (Modelo 2)** e declarações individuais de rendimentos. |
| RF-17-05 | Calendário de obrigações com alertas e estado (pendente, submetido, pago) e upload do comprovativo. |
| RF-17-06 | Validações prévias: trabalhadores sem NIF, sem n.º de Segurança Social, com dados incompletos. |
| RF-17-07 | Mapas para a Inspecção Geral do Trabalho: quadro de pessoal, horários, férias, horas extra. |

---

## M18 — Portal do trabalhador (self-service)

Aplicação web responsiva, optimizada para o navegador do telemóvel. A aplicação móvel nativa está fora do âmbito nesta fase.

| ID | Requisito |
| --- | --- |
| RF-18-01 | Consultar e descarregar **recibos de vencimento** e declarações de rendimentos. |
| RF-18-02 | Ver saldos e pedir **férias**, justificar **faltas**, pedir **adiantamentos** e **reembolsos**. |
| RF-18-03 | Registar presença no navegador do telemóvel, com geolocalização. |
| RF-18-04 | Consultar a escala de turnos e pedir trocas. |
| RF-18-05 | Pedir **declarações** (de serviço, de rendimentos para bancos, para visto) geradas automaticamente. |
| RF-18-06 | Actualizar dados pessoais (com validação do RH para os campos críticos). |
| RF-18-07 | Consultar objectivos, fazer auto-avaliação e dar feedback. |
| RF-18-08 | Inscrever-se em formações e ver certificados. |
| RF-18-09 | Receber comunicados da empresa e notificações. |
| RF-18-10 | Para as chefias: caixa de aprovações pendentes da equipa. |
| RF-18-11 | Entrada por telemóvel com código OTP por SMS, para trabalhadores sem e-mail. |

---

## M19 — Comunicação interna e notificações

Rotas actuais: `/messages`, `/notifications`.

| ID | Requisito |
| --- | --- |
| RF-19-01 | Mensagens internas entre RH e trabalhadores (tempo real via WebSocket). |
| RF-19-02 | Comunicados para toda a empresa ou para grupos, com confirmação de leitura. |
| RF-19-03 | Centro de notificações com tipos configuráveis: aprovações pendentes, prazos legais, expiração de documentos, aniversários, fim de contratos. |
| RF-19-04 | Canais de entrega: aplicação, e-mail, SMS e WhatsApp, com preferências por utilizador. |
| RF-19-05 | Canal de denúncias anónimo (ética e assédio), com acesso restrito. |

---

## M20 — Documentos e modelos

| ID | Requisito |
| --- | --- |
| RF-20-01 | Editor de modelos com variáveis para contratos, adendas, declarações, cartas, notas de culpa, certificados. |
| RF-20-02 | Geração em PDF com logótipo, carimbo e assinatura digital da empresa. |
| RF-20-03 | Código QR de verificação de autenticidade nas declarações emitidas. |
| RF-20-04 | Arquivo documental por trabalhador e por empresa, com pesquisa e prazos de conservação. |

---

## M21 — Relatórios e análise (People Analytics)

Rota actual: `/` (Dashboard).

| ID | Requisito |
| --- | --- |
| RF-21-01 | **Dashboard** com indicadores principais: efectivo, custo com pessoal, evolução da folha, IRT e INSS, absentismo, horas extra, rotatividade, distribuição por género e idade. |
| RF-21-02 | Relatórios padrão: listagem de trabalhadores, mapa de vencimentos, resumo da folha por centro de custo, mapa de férias, aniversários, contratos a terminar, documentos a expirar. |
| RF-21-03 | Construtor de relatórios personalizado (escolha de colunas, filtros, agrupamentos) com exportação para Excel, CSV e PDF. |
| RF-21-04 | Relatórios agendados enviados por e-mail. |
| RF-21-05 | **Indicadores de RH:** taxa de rotatividade, absentismo, tempo médio de recrutamento, custo por contratação, horas de formação, rácio de angolanização, diferença salarial por género. |
| RF-21-06 | **Orçamento e previsões** de custo com pessoal para o ano seguinte (simulação de aumentos salariais e de novas admissões). |
| RF-21-07 | Relatório de **Balanço Social** anual. |

---

## M22 — Expatriados e mobilidade

| ID | Requisito |
| --- | --- |
| RF-22-01 | Registo de vistos de trabalho e autorizações de residência, com alertas de renovação. |
| RF-22-02 | Pacotes de expatriação (habitação, escola dos filhos, viagens, seguro internacional). |
| RF-22-03 | Remuneração líquida garantida (*net pay*) com cálculo inverso. |
| RF-22-04 | Repartição do pagamento entre Angola e o exterior, nos termos da regulamentação cambial do BNA. |
| RF-22-05 | Controlo do rácio de trabalhadores nacionais e estrangeiros. |

---

## M23 — Prestadores de serviço

| ID | Requisito |
| --- | --- |
| RF-23-01 | Registo de prestadores individuais (Grupo B do IRT) e empresas prestadoras. |
| RF-23-02 | Registo de facturas/recibos com retenção na fonte quando aplicável. |
| RF-23-03 | Mapa de retenções a terceiros. |

---

## M24 — Configurações

Rota actual: `/settings`.

| ID | Requisito |
| --- | --- |
| RF-24-01 | Dados da empresa, logótipo e identidade dos documentos. |
| RF-24-02 | **Parâmetros legais versionados:** tabela de IRT, taxas de Segurança Social, salário mínimo, limites de isenção, feriados, taxas de horas extra. Actualizados centralmente pela equipa pagador.ao e com possibilidade de excepções por cliente. |
| RF-24-03 | Rubricas de folha (vencimentos, descontos, encargos) e respectivas fórmulas. |
| RF-24-04 | Catálogos: motivos de falta, tipos de licença, tipos de contrato, categorias de despesa, bancos. |
| RF-24-05 | Fluxos de aprovação. |
| RF-24-06 | Utilizadores, perfis e permissões. |
| RF-24-07 | Preferências de notificação, idioma, tema (claro/escuro). |
| RF-24-08 | Gestão da subscrição e facturação do serviço. |
| RF-24-09 | **Assistente de configuração inicial** para novas empresas (dados da empresa → estrutura → rubricas → importação de trabalhadores → primeira folha). |

---

## M25 — Auditoria e conformidade

| ID | Requisito |
| --- | --- |
| RF-25-01 | Registo imutável de todas as operações: quem, o quê, quando, de onde, valor anterior e valor novo. |
| RF-25-02 | Consulta e exportação do registo de auditoria com filtros. |
| RF-25-03 | Relatório de acessos a dados sensíveis. |
| RF-25-04 | Segregação de funções configurável (ex.: quem calcula a folha não a aprova). |
| RF-25-05 | Painel de conformidade: obrigações em atraso, trabalhadores com documentos em falta, contratos irregulares. |

---

## Central de ajuda

Rota actual: `/help`. Base de conhecimento com artigos, vídeos e perguntas frequentes sobre o uso do sistema e sobre legislação laboral e fiscal angolana, pesquisa, assistente de ajuda contextual e abertura de pedidos de suporte.
