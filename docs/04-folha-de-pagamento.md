# 04 — Motor da folha de pagamento

O motor de cálculo é o coração do pagador.ao. Deve ser **determinístico** (os mesmos dados de entrada produzem sempre o mesmo resultado), **explicável** (cada valor mostra a sua origem e fórmula) e **parametrizável** (nenhuma taxa legal codificada).

## 4.1 Conceitos

| Conceito | Definição |
| --- | --- |
| **Período de processamento** | Intervalo a que a folha respeita (ex.: Outubro de 2026). Tem data de início, data de fim, data de pagamento e estado. |
| **Processamento** | Execução do cálculo para um conjunto de trabalhadores num período. Tipos: normal, subsídio de férias, subsídio de Natal, prémios, retroactivos, complementar, acerto final. |
| **Rubrica** | Linha do recibo: vencimento (abono), desconto ou encargo patronal. |
| **Lançamento** | Valor de uma rubrica para um trabalhador num período: fixo (vem do contrato), variável (introduzido no período) ou calculado (fórmula). |
| **Tabela legal** | Dado versionado com vigência: escalões de IRT, taxas de Segurança Social, salário mínimo, limites de isenção. |
| **Recibo** | Resultado do cálculo para um trabalhador num processamento. |

## 4.2 Atributos de uma rubrica

| Atributo | Descrição | Exemplo |
| --- | --- | --- |
| `codigo` | Código único | `R001` |
| `nome` | Descrição no recibo | Vencimento base |
| `tipo` | `VENCIMENTO`, `DESCONTO`, `ENCARGO_PATRONAL`, `INFORMATIVA` | `VENCIMENTO` |
| `natureza` | `FIXA`, `VARIAVEL`, `CALCULADA` | `FIXA` |
| `formula` | Expressão de cálculo (ver 4.5) | `contrato.salario_base` |
| `sujeito_irt` | Entra no rendimento tributável | `true` |
| `limite_isencao_irt` | Valor mensal não sujeito; o excesso é tributado | `30000` |
| `incide_seguranca_social` | Entra na base de incidência do INSS | `true` |
| `entra_subsidio_ferias` | Integra a base do subsídio de férias | `true` |
| `entra_subsidio_natal` | Integra a base do subsídio de Natal | `true` |
| `proporcional_dias` | Reduz com faltas e admissões/cessações a meio do mês | `true` |
| `conta_contabilistica` | Conta do plano de contas (PGC Angola) a debitar/creditar | `72.1` |
| `ordem_calculo` | Precedência entre rubricas | `10` |
| `visivel_recibo` | Aparece no recibo do trabalhador | `true` |
| `vigencia_inicio` / `vigencia_fim` | Período de validade da configuração | `2026-01-01` |

## 4.3 Rubricas pré-configuradas

### Vencimentos

| Código | Rubrica | IRT | INSS | Observações |
| --- | --- | --- | --- | --- |
| R001 | Vencimento base | Sim | Sim | Proporcional a dias trabalhados |
| R010 | Subsídio de alimentação | Excesso de 30 000 Kz | Parametrizável | Pode ser por dia trabalhado |
| R011 | Subsídio de transporte | Excesso de 30 000 Kz | Parametrizável | Pode ser por dia trabalhado |
| R012 | Subsídio de habitação | Sim | Sim | |
| R013 | Subsídio de turno | Sim | Sim | |
| R014 | Subsídio de isolamento | Sim | Sim | Sector petrolífero/mineiro |
| R015 | Subsídio de risco | Sim | Sim | |
| R016 | Subsídio de chefia/função | Sim | Sim | |
| R017 | Subsídio de comunicações | Sim | Parametrizável | |
| R018 | Abono de família | Dentro do limite legal | Não | Por dependente |
| R020 | Horas extra — dia útil | Sim | Sim | Acréscimo por escalão |
| R021 | Horas extra — descanso/feriado | Sim | Sim | |
| R022 | Trabalho nocturno | Sim | Sim | |
| R030 | Subsídio de férias | Sim | Sim | ≥ 50% do vencimento base |
| R031 | Subsídio de Natal | Sim | Sim | ≥ 50% do vencimento base |
| R040 | Prémio de desempenho | Sim | Sim | |
| R041 | Comissões | Sim | Sim | |
| R050 | Ajudas de custo | Excesso do limite legal | Não | |
| R051 | Reembolso de despesas | Não | Não | Documentadas |
| R060 | Indemnização por cessação | Dentro do limite legal | Não | |
| R070 | Retroactivos | Sim | Sim | Referência ao período de origem |

### Descontos

| Código | Rubrica | Observações |
| --- | --- | --- |
| D001 | Segurança Social — trabalhador (3%) | Sobre a base de incidência |
| D002 | IRT — retenção na fonte | Tabela do Grupo A em vigor |
| D010 | Faltas injustificadas | Valor dia × dias |
| D011 | Atrasos | Valor hora × horas |
| D020 | Adiantamento salarial | |
| D021 | Prestação de empréstimo | |
| D030 | Penhora judicial | Respeita o limite impenhorável |
| D031 | Quota sindical | Com autorização |
| D040 | Comparticipação do seguro de saúde | |
| D050 | Outros descontos autorizados | |

### Encargos patronais (não aparecem no líquido)

| Código | Rubrica |
| --- | --- |
| E001 | Segurança Social — entidade empregadora (8%) |
| E010 | Seguro de acidentes de trabalho |
| E011 | Seguro de saúde — parte da empresa |
| E020 | Provisão para férias e subsídios |

## 4.4 Algoritmo de cálculo (por trabalhador)

```
1. Carregar contexto
   - contrato vigente no período (pode haver mais de um se houve alteração a meio do mês)
   - tabelas legais vigentes à data de referência do processamento
   - assiduidade fechada do período (faltas, atrasos, horas extra, horas nocturnas)
   - lançamentos variáveis do período
   - empréstimos, adiantamentos e penhoras activos

2. Calcular os valores de referência
   - dias de calendário do período; dias trabalhados
   - valor dia  = vencimento_base / 30                     (parametrizável: 30 ou dias úteis)
   - valor hora = (vencimento_base × 12) / (52 × horas_semanais)

3. Calcular os vencimentos pela ordem_calculo
   - fixos (proporcionais quando há admissão, cessação, licença sem vencimento)
   - variáveis e calculados (horas extra, nocturno, prémios, subsídios)

4. Calcular a base de Segurança Social
   base_ss = Σ vencimentos com incide_seguranca_social = true (− faltas que a reduzem)

5. Segurança Social
   ss_trabalhador = arredondar(base_ss × taxa_trabalhador)    (3%)
   ss_empresa     = arredondar(base_ss × taxa_empresa)        (8%)

6. Base de IRT
   para cada vencimento sujeito:
       valor_tributavel = max(0, valor − limite_isencao_irt)  (sem limite → valor total)
   rendimento_tributavel = Σ valor_tributavel − faltas/descontos que reduzem a remuneração
   materia_colectavel    = rendimento_tributavel − ss_trabalhador

7. IRT
   escalão = tabela_irt.encontrar(materia_colectavel)
   irt = arredondar(escalão.parcela_fixa + (materia_colectavel − escalão.excesso_sobre) × escalão.taxa)

8. Outros descontos (pela ordem de prioridade legal)
   penhoras → quotas → empréstimos → adiantamentos → outros
   garantir: líquido ≥ limite impenhorável; caso contrário, adiar prestações e gerar alerta

9. Totais
   total_vencimentos = Σ vencimentos
   total_descontos   = Σ descontos
   liquido           = total_vencimentos − total_descontos
   custo_empresa     = total_vencimentos + Σ encargos_patronais

10. Validações e alertas (ver 4.7)

11. Guardar o recibo com o "rasto de cálculo" (inputs, versão das tabelas, fórmulas avaliadas)
```

**Arredondamentos:** cada linha é arredondada a 2 casas decimais (cêntimos), com arredondamento comercial (meio para cima). Os totais são a soma das linhas arredondadas. Todos os cálculos usam **aritmética decimal exacta**, nunca vírgula flutuante.

## 4.5 Linguagem de fórmulas

As rubricas calculadas usam uma linguagem de expressões segura e sem efeitos secundários, com acesso a variáveis de contexto:

```
contrato.salario_base
contrato.horas_semanais
trabalhador.antiguidade_anos
trabalhador.n_dependentes
periodo.dias_uteis
assiduidade.horas_extra_util
assiduidade.faltas_injustificadas
rubrica("R001")                 # valor já calculado de outra rubrica
tabela("salario_minimo")
```

Exemplos:

```
# Subsídio de alimentação por dia trabalhado
1500 * assiduidade.dias_trabalhados

# Diuturnidades: 2% do vencimento base por cada 3 anos de antiguidade, até 5 diuturnidades
rubrica("R001") * 0.02 * min(floor(trabalhador.antiguidade_anos / 3), 5)

# Horas extra em dia útil (primeiro escalão com acréscimo de 50%)
valor_hora() * 1.5 * assiduidade.horas_extra_util
```

Cada fórmula é validada na gravação e testada com um trabalhador de exemplo antes de ser activada.

## 4.6 Exemplo de cálculo

> Exemplo ilustrativo, com os valores por omissão do documento [02](./02-enquadramento-legal.md). Pressupõe-se que os subsídios de alimentação e transporte incidem sobre a Segurança Social (parametrizável).

**Dados:** trabalhador a tempo inteiro (44 h/semana), mês de Outubro de 2026.

| Item | Valor |
| --- | --- |
| Vencimento base | 300 000,00 Kz |
| Subsídio de alimentação | 40 000,00 Kz |
| Subsídio de transporte | 30 000,00 Kz |
| Horas extra em dia útil | 5 horas (acréscimo de 50%) |
| Faltas injustificadas | 1 dia |

**Passo 1 — valores de referência**

- Valor hora = 300 000 × 12 / (52 × 44) = 3 600 000 / 2 288 = **1 573,43 Kz**
- Valor dia = 300 000 / 30 = **10 000,00 Kz**

**Passo 2 — vencimentos e desconto de faltas**

| Rubrica | Cálculo | Valor (Kz) |
| --- | --- | --- |
| Vencimento base | | 300 000,00 |
| Subsídio de alimentação | | 40 000,00 |
| Subsídio de transporte | | 30 000,00 |
| Horas extra — dia útil | 1 573,4266 × 1,5 × 5 | 11 800,70 |
| Falta injustificada | − 10 000 × 1 | − 10 000,00 |
| **Remuneração ilíquida** | | **371 800,70** |

**Passo 3 — Segurança Social**

- Base de incidência = 371 800,70 Kz
- Trabalhador (3%) = **11 154,02 Kz**
- Entidade empregadora (8%) = **29 744,06 Kz**

**Passo 4 — IRT**

| Componente | Valor (Kz) |
| --- | --- |
| Vencimento base − falta | 290 000,00 |
| Horas extra | 11 800,70 |
| Subsídio de alimentação (excesso de 30 000) | 10 000,00 |
| Subsídio de transporte (excesso de 30 000) | 0,00 |
| **Rendimento tributável** | **311 800,70** |
| (−) Segurança Social do trabalhador | − 11 154,02 |
| **Matéria colectável** | **300 646,68** |

- Escalão 5 (300 000,01 a 500 000): IRT = 49 250 + (300 646,68 − 300 000) × 19% = 49 250 + 122,87 = **49 372,87 Kz**

**Passo 5 — recibo**

| | Valor (Kz) |
| --- | --- |
| Total ilíquido | 371 800,70 |
| (−) Segurança Social (3%) | 11 154,02 |
| (−) IRT | 49 372,87 |
| **Líquido a receber** | **311 273,81** |
| Encargo patronal com a Segurança Social (8%) | 29 744,06 |
| **Custo total para a empresa** | **401 544,76** |

Este exemplo deve ser incluído como **teste automatizado** do motor de cálculo, a par de casos de fronteira de cada escalão de IRT.

## 4.7 Validações e alertas antes da aprovação

| Tipo | Validação |
| --- | --- |
| Bloqueante | Trabalhador activo sem contrato vigente |
| Bloqueante | Líquido negativo |
| Bloqueante | Pagamento por transferência sem IBAN válido |
| Bloqueante | Tabela legal inexistente para a data de referência |
| Aviso | Vencimento base abaixo do salário mínimo |
| Aviso | Trabalhador sem NIF ou sem n.º de Segurança Social |
| Aviso | Variação do líquido superior a X% face ao mês anterior (X configurável) |
| Aviso | Horas extra acima do limite legal |
| Aviso | Prestações de empréstimo adiadas por limite impenhorável |
| Aviso | Assiduidade do período ainda não fechada |
| Informativo | Admissões, cessações e alterações salariais do período |

## 4.8 Ciclo mensal de processamento

```
 Dia  1–20   Lançamentos do mês: admissões, alterações, variáveis, prémios
 Dia  20–25  Fecho da assiduidade (faltas, horas extra)
 Dia  25     Pré-folha (simulação) e revisão
 Dia  26     Cálculo definitivo → Em revisão
 Dia  27     Aprovação (director financeiro)
 Dia  28     Geração dos ficheiros bancários → aprovação do pagamento
 Último dia útil  Pagamento; envio dos recibos aos trabalhadores
 Mês seguinte, até dia 10   Folha de remunerações e pagamento ao INSS
 Mês seguinte, até ao fim   Declaração e entrega do IRT à AGT
 Fecho        Folha fechada; lançamento contabilístico exportado
```

As datas são configuráveis por empresa; o sistema gera tarefas e alertas para cada etapa.

## 4.9 Estados do processamento

| Estado | Pode editar lançamentos | Pode recalcular | Quem muda o estado |
| --- | --- | --- | --- |
| Rascunho | Sim | Sim | Processador salarial |
| Calculada | Sim (invalida o cálculo) | Sim | Processador salarial |
| Em revisão | Não | Não | Processador → Revisor |
| Aprovada | Não | Não | Aprovador (≠ processador) |
| Paga | Não | Não | Finanças, após confirmação bancária |
| Fechada | Não | Não | Sistema / Administrador |

A reabertura de uma folha aprovada exige permissão especial, justificação e fica registada na auditoria. Uma folha **fechada** nunca é reaberta: as correcções fazem-se por folha complementar ou no período seguinte.

## 4.10 Processamentos especiais

### Subsídio de férias
Base = Σ rubricas com `entra_subsidio_ferias = true` × percentagem (≥ 50%) × proporção de dias de direito. Pago no mês configurado.

### Subsídio de Natal
Base = Σ rubricas com `entra_subsidio_natal = true` × percentagem (≥ 50%) × (meses de serviço no ano / 12). Pago até Dezembro.

### Retroactivos
Quando um aumento salarial tem data de efeito anterior ao período em curso, o sistema calcula a diferença mês a mês, aplicando as tabelas legais de cada mês, e lança-a na rubrica R070 com o detalhe dos períodos de origem.

### Acerto final de contas
Calculado no módulo M16 com: vencimento dos dias trabalhados no mês da cessação, férias vencidas e não gozadas, subsídio de férias correspondente, proporcionais de férias e de subsídio de Natal, indemnização ou compensação, aviso prévio (a pagar ou a descontar), saldo de empréstimos e adiantamentos.

### Cálculo inverso (líquido → ilíquido)
Pesquisa iterativa (ex.: bissecção) do vencimento base que produz o líquido pretendido com as rubricas fixas indicadas, com tolerância de 0,01 Kz.

## 4.11 Exportação contabilística

No fecho, o sistema gera o lançamento contabilístico segundo o **Plano Geral de Contabilidade (PGC) de Angola**, com mapeamento configurável de rubricas para contas e repartição por centro de custo:

- Débito: custos com pessoal (remunerações, encargos sobre remunerações).
- Crédito: pessoal — remunerações a pagar; Estado — IRT a pagar; INSS a pagar; outros credores (sindicatos, penhoras).

Formatos: Excel, CSV, ficheiros de importação para softwares de contabilidade usados em Angola e integração por API com ERPs (ver [07 — Integrações](./07-integracoes.md)).
