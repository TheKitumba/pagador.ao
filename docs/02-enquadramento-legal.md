# 02 — Enquadramento legal angolano

> **Aviso importante.** Este documento resume a legislação relevante para o desenho do sistema. Não substitui aconselhamento jurídico ou fiscal. Todos os valores (taxas, escalões, limites, prazos) devem estar **parametrizados com data de início e fim de vigência** e ser validados por um jurista ou técnico de contas antes de cada utilização em produção, em particular após a publicação de cada Orçamento Geral do Estado (OGE).

## 2.1 Diplomas de referência

| Área | Diploma | Impacto no sistema |
| --- | --- | --- |
| Relações laborais | Lei Geral do Trabalho — Lei n.º 12/23, de 27 de Dezembro | Contratos, período experimental, horário, férias, faltas, licenças, cessação, indemnizações |
| Imposto sobre o rendimento do trabalho | Código do IRT — Lei n.º 18/14, com as alterações da Lei n.º 28/20, de 22 de Julho, e posteriores | Cálculo da retenção na fonte, rendimentos isentos, declarações |
| Protecção social obrigatória | Lei de Bases da Protecção Social (Lei n.º 7/04) e Decreto Presidencial n.º 227/18 | Contribuições do trabalhador e da entidade empregadora, base de incidência |
| Salário mínimo | Decreto Presidencial que fixa o salário mínimo nacional (em vigor à data) | Validação de salário base mínimo |
| Feriados | Lei n.º 11/18 (feriados nacionais e datas de celebração) | Calendário, horas em feriado, cálculo de dias úteis |
| Protecção de dados | Lei n.º 22/11, de 17 de Junho (Lei da Protecção de Dados Pessoais) | Consentimento, finalidade, segurança, direitos dos titulares, notificação à APD |
| Procedimentos tributários | Código Geral Tributário e Código de Procedimento e Processo Tributário | Prazos, multas, juros |
| Documentos fiscais electrónicos | Regime jurídico de facturação (Decreto Presidencial n.º 312/18) e SAF-T (AO) | Relevante se o sistema emitir facturas (ex.: subscrição) e para exportações contabilísticas |
| Trabalho de estrangeiros | Regime jurídico dos estrangeiros e legislação sobre trabalhadores não residentes | Vistos de trabalho, quotas, contratos de não residentes |
| PME | Lei n.º 30/11 | Classificação da dimensão da empresa |

## 2.2 Lei Geral do Trabalho (LGT) — regras a modelar

Os valores indicados são os valores por omissão a configurar; o sistema deve permitir que convenções colectivas ou regulamentos internos mais favoráveis os substituam.

### 2.2.1 Contrato de trabalho

- **Modalidades:** tempo indeterminado (regra geral), tempo determinado (a termo certo ou incerto), contrato de aprendizagem e estágio, contrato de trabalho a tempo parcial, trabalho temporário, trabalho no domicílio, teletrabalho, regimes especiais (trabalhadores não residentes, desportistas, trabalho doméstico, entre outros).
- **Registos obrigatórios:** identificação das partes, categoria profissional, local de trabalho, data de início, período normal de trabalho, remuneração, duração (quando a termo) e justificação do termo.
- **Período experimental:** parametrizável por tipo de contrato e categoria, com alerta antes do fim.
- **Renovações de contratos a termo:** controlo do número de renovações e da duração máxima, com alerta antes do fim e conversão automática em tempo indeterminado quando os limites legais forem excedidos.

### 2.2.2 Tempo de trabalho

- **Período normal de trabalho:** por omissão 8 horas diárias e 44 horas semanais, parametrizável por contrato e regime (ex.: regimes de adaptabilidade, turnos, rotação).
- **Descanso semanal:** pelo menos um dia (normalmente o domingo), com regime de descanso complementar.
- **Trabalho nocturno:** período legal parametrizável, com acréscimo remuneratório.
- **Trabalho extraordinário (horas extra):** limites diários, mensais e anuais parametrizáveis; acréscimos percentuais distintos por escalão de horas, por dimensão da empresa e para dias de descanso e feriados.
- **Regimes de rotação** (ex.: 14/14, 28/28 no sector petrolífero), com cálculo de dias de campo e de folga.

### 2.2.3 Férias

- **Direito a férias:** 22 dias úteis por ano civil (valor por omissão), com regras próprias no ano de admissão.
- **Subsídio de férias:** pelo menos 50% da remuneração de base correspondente ao período de férias, pago, em regra, antes do gozo ou no mês definido pela empresa.
- **Marcação:** por acordo; na falta de acordo, pela entidade empregadora dentro dos limites legais. Mapa de férias anual.
- **Acumulação e férias não gozadas:** regras de transição para o ano seguinte e pagamento em caso de cessação.

### 2.2.4 Gratificação de fim de ano (subsídio de Natal)

- Pelo menos 50% da remuneração de base, pago até ao mês de Dezembro, proporcional ao tempo de serviço no ano de admissão e de cessação.

### 2.2.5 Faltas

- **Justificadas** (com ou sem perda de remuneração conforme o motivo): casamento, falecimento de familiares, doença, acidente, nascimento de filho, cumprimento de obrigações legais, actividade sindical, provas escolares, entre outras.
- **Injustificadas:** desconto na remuneração e, em caso de reincidência, possível infracção disciplinar.
- O sistema deve ter um **catálogo de motivos de falta** configurável, indicando para cada motivo: dias máximos, documento comprovativo exigido, se desconta remuneração e se desconta subsídio de alimentação/transporte.

### 2.2.6 Licenças e protecção na parentalidade

- **Licença de maternidade**, com acréscimo em caso de parto múltiplo; pagamento, em regra, assegurado pela Segurança Social mediante requerimento.
- **Licença de paternidade** e outras licenças previstas na LGT vigente.
- **Dispensa para amamentação.**
- **Licença sem vencimento.**
- **Protecção contra despedimento** da trabalhadora grávida ou lactante (alerta no módulo de cessação).

### 2.2.7 Remuneração

- Pagamento em dinheiro (Kwanzas), cheque ou transferência bancária, com recibo detalhado.
- Respeito pelo **salário mínimo nacional** em vigor (o sistema deve bloquear ou alertar quando o salário base de um contrato a tempo inteiro ficar abaixo do mínimo aplicável ao sector ou dimensão).
- Prazo de pagamento: até ao último dia útil do mês a que respeita, ou conforme contrato.
- Limites aos descontos sobre o salário (penhoras, adiantamentos, compensações).

### 2.2.8 Cessação do contrato

O sistema deve suportar todas as formas de cessação previstas e calcular automaticamente o **acerto final de contas**:

| Forma de cessação | Elementos a calcular |
| --- | --- |
| Caducidade (fim do termo, reforma, morte, impossibilidade) | Compensação por caducidade quando aplicável, proporcionais |
| Acordo revogatório | Montante acordado, proporcionais |
| Despedimento disciplinar | Proporcionais; indemnização se for declarado improcedente |
| Despedimento por causas objectivas (económicas, tecnológicas, estruturais) | Aviso prévio, indemnização calculada segundo a antiguidade e a dimensão da empresa |
| Demissão (rescisão pelo trabalhador) | Aviso prévio (ou compensação pela falta dele), proporcionais |
| Rescisão com justa causa pelo trabalhador | Indemnização, proporcionais |

Os **proporcionais** incluem: férias vencidas e não gozadas, subsídio de férias, proporcional de férias do ano da cessação, proporcional do subsídio de Natal, horas extra pendentes e outros créditos.

### 2.2.9 Documentação obrigatória

- Processo individual do trabalhador.
- Mapa de férias.
- Registo de horas extraordinárias.
- Registo de acidentes de trabalho.
- Regulamento interno (quando aplicável).
- Quadro de pessoal.
- Certificado de trabalho emitido na cessação.

## 2.3 Imposto sobre os Rendimentos do Trabalho (IRT)

### 2.3.1 Grupos de tributação

| Grupo | Rendimentos | Tratamento no sistema |
| --- | --- | --- |
| Grupo A | Trabalho por conta de outrem | Retenção na fonte mensal pela entidade empregadora — **núcleo do sistema** |
| Grupo B | Trabalho por conta própria (profissionais liberais e prestadores de serviço) | Retenção sobre facturas de prestadores, quando aplicável (módulo de prestadores) |
| Grupo C | Actividades comerciais e industriais | Fora do âmbito do processamento salarial |

### 2.3.2 Matéria colectável (Grupo A)

```
Matéria colectável = Rendimentos sujeitos − Rendimentos isentos/excluídos − Contribuição do trabalhador para a Segurança Social
```

Rendimentos que, à data da Lei n.º 28/20, eram **total ou parcialmente excluídos** de tributação (valores a parametrizar):

| Rendimento | Tratamento por omissão |
| --- | --- |
| Subsídio de alimentação | Não sujeito até 30 000 Kz/mês; o excesso é tributado |
| Subsídio de transporte | Não sujeito até 30 000 Kz/mês; o excesso é tributado |
| Abono de família | Não sujeito dentro do limite legal |
| Ajudas de custo | Não sujeitas até ao limite legal, se atribuídas em deslocações em serviço e devidamente documentadas |
| Indemnizações por cessação | Isentas dentro dos limites legais |
| Reembolso de despesas documentadas | Não sujeito |
| Contribuições da entidade empregadora para a Segurança Social | Não sujeitas |

Cada **rubrica** da folha deve ter atributos `sujeito_irt`, `limite_isencao_irt` e `incide_seguranca_social` (ver [04 — Motor da folha](./04-folha-de-pagamento.md)).

### 2.3.3 Tabela de retenção — Grupo A (valores por omissão, Lei n.º 28/20)

| Escalão | Matéria colectável (Kz) | Parcela fixa (Kz) | Taxa sobre o excesso | Excesso sobre (Kz) |
| --- | --- | --- | --- | --- |
| 1 | até 100 000 | 0 | Isento | — |
| 2 | 100 000,01 a 150 000 | 0 | 13% | 100 000 |
| 3 | 150 000,01 a 200 000 | 12 500 | 16% | 150 000 |
| 4 | 200 000,01 a 300 000 | 31 250 | 18% | 200 000 |
| 5 | 300 000,01 a 500 000 | 49 250 | 19% | 300 000 |
| 6 | 500 000,01 a 1 000 000 | 87 250 | 20% | 500 000 |
| 7 | 1 000 000,01 a 1 500 000 | 187 249 | 21% | 1 000 000 |
| 8 | 1 500 000,01 a 2 000 000 | 292 249 | 22% | 1 500 000 |
| 9 | 2 000 000,01 a 2 500 000 | 402 249 | 23% | 2 000 000 |
| 10 | 2 500 000,01 a 5 000 000 | 517 249 | 24% | 2 500 000 |
| 11 | 5 000 000,01 a 10 000 000 | 1 117 249 | 24,5% | 5 000 000 |
| 12 | acima de 10 000 000 | 2 342 248 | 25% | 10 000 000 |

```
IRT = Parcela fixa + (Matéria colectável − Excesso sobre) × Taxa
```

> A tabela é um **dado versionado**. Qualquer alteração (por exemplo, via OGE) é registada como uma nova versão com data de início de vigência, sem apagar a anterior, para permitir reprocessar meses passados com a tabela correcta.

### 2.3.4 Casos especiais

- **Remunerações de meses anteriores** (retroactivos): tributação segundo as regras aplicáveis ao mês a que respeitam ou ao mês de pagamento, conforme a lei vigente, configurável.
- **Subsídio de férias e de Natal:** tributação autónoma ou conjunta com o salário do mês, conforme a regra vigente, configurável por rubrica.
- **Trabalhadores não residentes e expatriados:** regras próprias de residência fiscal e possíveis acordos para evitar a dupla tributação.
- **Rendimentos em espécie** (habitação, viatura, seguros): valorização segundo as regras legais.

### 2.3.5 Obrigações declarativas e prazos (AGT)

| Obrigação | Periodicidade | Prazo por omissão | Saída do sistema |
| --- | --- | --- | --- |
| Entrega do IRT retido | Mensal | Até ao último dia do mês seguinte ao da retenção | Mapa de retenções e documento de liquidação |
| Declaração de remunerações | Mensal | Juntamente com a entrega do imposto | Ficheiro/mapa no formato exigido pelo Portal do Contribuinte |
| Declaração anual de rendimentos (Modelo 2) | Anual | Até ao fim de Fevereiro do ano seguinte | Mapa anual por trabalhador |
| Declaração de rendimentos ao trabalhador | Anual / a pedido | — | Documento por trabalhador |

O sistema deve ter um **calendário fiscal** com alertas antes do fim de cada prazo.

## 2.4 Segurança Social (INSS)

### 2.4.1 Taxas contributivas (valores por omissão)

| Contribuinte | Taxa |
| --- | --- |
| Trabalhador por conta de outrem | 3% |
| Entidade empregadora | 8% |
| **Total** | **11%** |

Regimes específicos (trabalhadores por conta própria, trabalho doméstico, reformados que continuam a trabalhar, pensionistas, entre outros) devem poder ter taxas próprias.

### 2.4.2 Base de incidência

A base de incidência é a remuneração ilíquida mensal, abrangendo o salário base e as prestações de carácter regular e periódico, conforme o Decreto Presidencial n.º 227/18. Cada rubrica indica se incide ou não sobre a Segurança Social; as rubricas excluídas por lei (ex.: ajudas de custo dentro dos limites, abono de família, reembolsos de despesas) vêm pré-configuradas como não sujeitas.

### 2.4.3 Obrigações

| Obrigação | Prazo por omissão | Saída do sistema |
| --- | --- | --- |
| Inscrição da entidade empregadora | Antes da primeira admissão | Dados da empresa |
| Inscrição do trabalhador | Na admissão | Ficha de inscrição, alerta de trabalhadores sem número de Segurança Social |
| Folha de remunerações mensal | Até ao dia 10 do mês seguinte | Ficheiro de remunerações no formato do portal do INSS |
| Pagamento das contribuições | Até ao dia 10 do mês seguinte | Guia de pagamento / referência |
| Comunicação de cessação | Na cessação | Alerta e documento |

## 2.5 Protecção de dados pessoais (Lei n.º 22/11)

O sistema trata dados pessoais e, em alguns casos, dados sensíveis (saúde, filiação sindical, dados biométricos). Requisitos obrigatórios:

- **Finalidade e minimização:** recolher apenas os dados necessários à relação laboral.
- **Base legal e consentimento:** registar a base legal de cada tratamento; consentimento explícito para dados biométricos e de saúde quando exigido.
- **Notificação/autorização da Agência de Protecção de Dados (APD):** apoiar o cliente com a documentação dos tratamentos realizados.
- **Direitos dos titulares:** acesso, rectificação, oposição e eliminação (respeitando os prazos legais de conservação de documentos laborais e fiscais).
- **Segurança:** cifra em trânsito e em repouso, controlo de acessos, registo de auditoria (ver [08 — Requisitos não funcionais](./08-requisitos-nao-funcionais.md)).
- **Transferência internacional:** se a infra-estrutura estiver fora de Angola, assegurar o cumprimento das regras de transferência internacional de dados.
- **Prazos de conservação:** documentos de folha e fiscais conservados pelo prazo legal aplicável (parametrizável; por omissão, pelo menos 10 anos para documentos fiscais e contabilísticos).

## 2.6 Outros elementos de conformidade

- **Feriados nacionais (Lei n.º 11/18):** 1 de Janeiro, 4 de Fevereiro, Carnaval (data móvel), 8 de Março, 23 de Março, 4 de Abril, Sexta-feira Santa (data móvel), 1 de Maio, 17 de Setembro, 2 de Novembro, 11 de Novembro e 25 de Dezembro. Regra de "ponte" quando o feriado coincide com terça ou quinta-feira, conforme a lei. Feriados municipais e da empresa configuráveis.
- **Identificação:** validação de formato do Bilhete de Identidade (14 caracteres, ex.: `000000000LA000`), do NIF, do número de Segurança Social, do passaporte e do cartão de residente para estrangeiros.
- **Dados bancários:** validação de IBAN angolano (`AO06` seguido de 21 dígitos, 25 caracteres no total).
- **Inspecção Geral do Trabalho (IGT):** capacidade de produzir rapidamente o quadro de pessoal, mapas de horário, mapa de férias e registo de horas extra numa inspecção.
- **Seguro de acidentes de trabalho e doenças profissionais:** obrigatório; registo de apólice, seguradora e massa salarial declarada.
