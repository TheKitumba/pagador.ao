# 07 — Integrações

## 7.1 Visão geral

```
                   ┌──────────────────────┐
  Biométricos ────►│                      │────► Bancos (ficheiros em lote / API)
  Navegador   ────►│                      │────► AGT (mapas e declarações)
  Excel/CSV   ────►│      pagador.ao      │────► INSS (folha de remunerações)
  ERP / AD    ◄───►│   (API REST + eventos)│────► Contabilidade / ERP
  SSO (IdP)   ────►│                      │────► E-mail · SMS · WhatsApp
                   └──────────────────────┘────► Seguradoras
```

## 7.2 Bancos e pagamentos

| Integração | Descrição | Fase |
| --- | --- | --- |
| Ficheiros de transferência em lote | Geração de ficheiros no formato de cada banco (BAI, BFA, BIC, BPC, Millennium Atlântico, Standard Bank, Banco Sol, Banco Keve, Banco Económico, entre outros) para carregamento no internet banking empresarial | MVP |
| Formato interbancário EMIS | Ficheiro de transferências a crédito para pagamentos multi-banco | Fase 2 |
| Importação de extractos | Reconciliação de pagamentos a partir de extractos (CSV/MT940 quando disponível) | Fase 2 |
| API bancária directa | Envio de lotes e consulta de estado por API, onde o banco a disponibilize | Fase 3 |
| Carteiras móveis | Pagamento a trabalhadores sem conta bancária | Fase 3 |

**Requisitos:**

- Os formatos de ficheiro estão num **catálogo configurável** (layout, campos, encoding, separadores), para adicionar bancos sem nova versão do software.
- Validação do IBAN (dígitos de controlo) antes da geração.
- Cada ficheiro gerado é guardado, com hash, ligado ao lote e ao utilizador que o aprovou.

## 7.3 Administração Geral Tributária (AGT)

| Integração | Descrição |
| --- | --- |
| Mapas de IRT | Geração dos mapas/ficheiros de remunerações e retenções no formato exigido pelo Portal do Contribuinte |
| Declaração anual (Modelo 2) | Ficheiro anual por trabalhador |
| Validação de NIF | Consulta da validade do NIF, quando disponibilizada pela AGT |
| Submissão directa | Por API, se e quando a AGT a disponibilizar |

Os formatos devem ser versionados, porque a AGT os actualiza com frequência.

## 7.4 Instituto Nacional de Segurança Social (INSS)

| Integração | Descrição |
| --- | --- |
| Folha de remunerações | Ficheiro mensal no formato aceite pelo portal da Segurança Social |
| Inscrição de trabalhadores | Exportação dos dados para inscrição |
| Guia de pagamento | Registo da referência e do comprovativo |

## 7.5 Contabilidade e ERP

| Integração | Descrição |
| --- | --- |
| Exportação de lançamentos | Excel/CSV configurável com contas do PGC e centros de custo |
| Conectores ERP | SAP, Microsoft Dynamics, Primavera, PHC e outros softwares de gestão usados em Angola (por API ou ficheiro) |
| SAF-T (AO) | Contributo do processamento salarial para o ficheiro SAF-T contabilístico, quando aplicável |

## 7.6 Assiduidade

| Integração | Descrição |
| --- | --- |
| Terminais biométricos | Importação de marcações de terminais de impressão digital e reconhecimento facial (ZKTeco, Suprema, Hikvision, entre outros) por SDK, API ou ficheiro |
| Ponto no navegador | Marcação no computador ou no telemóvel, com geolocalização (a aplicação móvel nativa, com modo offline, está fora do âmbito nesta fase) |
| Quiosque | Tablet em modo quiosque com PIN, QR code ou reconhecimento facial |

## 7.7 Comunicação

| Canal | Utilização |
| --- | --- |
| E-mail transaccional | Recibos, convites, alertas, redefinição de palavra-passe |
| SMS | OTP de entrada, alertas para trabalhadores sem e-mail (fornecedores com cobertura Unitel, Africell e Movicel) |
| WhatsApp Business API | Envio de recibos e notificações, com opt-in do trabalhador |
| Notificações na aplicação | Centro de notificações em tempo real (SSE); push nativo apenas com a futura aplicação móvel |

## 7.8 Identidade e diretório

- **SSO:** SAML 2.0 e OpenID Connect (Microsoft Entra ID, Google Workspace, Okta).
- **Provisionamento:** SCIM 2.0 para criar e desactivar contas automaticamente a partir das admissões e cessações.

## 7.9 API pública e webhooks (plano Empresarial)

### API REST

- Base: `https://api.pagador.ao/v1`
- Autenticação: OAuth 2.0 (client credentials) com âmbitos (`employees:read`, `payroll:read`, `attendance:write`, ...).
- Formato: JSON, datas ISO 8601, valores monetários como string decimal (`"371800.70"`).
- Paginação por cursor; limites de pedidos por cliente.
- Documentação OpenAPI e ambiente sandbox para integradores.

Recursos principais:

```
GET    /employees
POST   /employees
GET    /employees/{id}
PATCH  /employees/{id}
GET    /employees/{id}/contracts
POST   /attendance/records           # importação de marcações
GET    /payroll/periods
GET    /payroll/runs/{id}/payslips
GET    /payslips/{id}/pdf
POST   /payroll/periods/{id}/variables  # lançamentos variáveis em massa
GET    /reports/{code}
```

### Webhooks

Eventos assinados com HMAC-SHA256, com novas tentativas em caso de falha:

```
employee.created         employee.updated        employee.terminated
contract.expiring        leave.approved          overtime.approved
payroll_run.calculated   payroll_run.approved    payroll_run.closed
payment_batch.approved   payment_batch.paid
```

## 7.10 Importação e exportação de dados

- Modelos Excel descarregáveis para trabalhadores, contratos, saldos de férias, lançamentos variáveis, empréstimos e histórico salarial.
- Assistente de **migração** a partir de folhas de cálculo e de outros softwares de salários, com mapeamento de colunas, pré-visualização e relatório de erros.
- Exportação completa dos dados do cliente (portabilidade) em formato aberto.
