# 06 — Modelo de dados

Modelo conceptual das entidades principais. Os nomes técnicos estão em inglês (`snake_case`) para o código e a base de dados; as descrições em português.

## 6.1 Princípios

- **Multi-inquilino (multi-tenant):** todas as tabelas de negócio têm `tenant_id` (conta) e, quando aplicável, `company_id`. O isolamento é garantido na camada de dados (ex.: Row-Level Security no PostgreSQL).
- **Histórico com data de efeito:** entidades que mudam ao longo do tempo (contrato, salário, cargo, departamento, dados bancários, tabelas legais) usam `effective_from` / `effective_to`, e não se sobrepõem.
- **Valores monetários:** `NUMERIC(18,2)` com código de moeda ISO 4217 (`AOA`, `USD`, `EUR`). Nunca `float`.
- **Identificadores:** UUID v7 (ordenáveis por tempo).
- **Eliminação lógica** (`archived_at`) para dados com obrigação de conservação.
- **Campos de auditoria** em todas as tabelas: `created_at`, `created_by`, `updated_at`, `updated_by`.

## 6.2 Diagrama de entidades (simplificado)

```
Tenant ─1:N─ Company ─1:N─ Establishment
                │
                ├─1:N─ OrgUnit (árvore: direcção > departamento > secção)
                ├─1:N─ CostCenter
                ├─1:N─ JobPosition ─N:1─ JobCategory ─1:N─ SalaryScale
                ├─1:N─ PayItem (rubricas)
                ├─1:N─ WorkSchedule
                └─1:N─ Employee
                          ├─1:N─ EmploymentContract ─1:N─ ContractAmendment
                          │            └─1:N─ ContractPayItem (rubricas fixas)
                          ├─1:N─ EmployeeAssignment (cargo, unidade, centro de custo, chefia — com vigência)
                          ├─1:N─ BankAccount
                          ├─1:N─ Dependent
                          ├─1:N─ EmployeeDocument
                          ├─1:N─ AttendanceRecord / TimeEntry / OvertimeRequest
                          ├─1:N─ LeaveRequest / Absence
                          ├─1:N─ Loan ─1:N─ LoanInstallment
                          ├─1:N─ Garnishment (penhora)
                          ├─1:N─ ExpenseClaim
                          ├─1:N─ PerformanceReview / Goal
                          ├─1:N─ TrainingEnrollment
                          ├─1:N─ DisciplinaryCase
                          └─1:N─ Payslip ─1:N─ PayslipLine

PayrollPeriod ─1:N─ PayrollRun ─1:N─ Payslip
PayrollRun ─1:N─ PaymentBatch ─1:N─ PaymentInstruction
LegalTable (IRT, SS, salário mínimo, feriados) ─ versionada, global ou por tenant
ApprovalWorkflow ─1:N─ ApprovalStep ;  ApprovalRequest ─1:N─ ApprovalAction
AuditLog (append-only)
```

## 6.3 Entidades principais

### Company (empresa)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | |
| tenant_id | uuid | |
| legal_name | text | Denominação social |
| trade_name | text | Nome comercial |
| nif | varchar(14) | Único por tenant |
| social_security_number | varchar | N.º de contribuinte do INSS |
| activity_code | varchar | CAE |
| size_class | enum | `MICRO`, `SMALL`, `MEDIUM`, `LARGE` |
| address | jsonb | Província, município, bairro, rua |
| default_currency | char(3) | `AOA` |
| fiscal_year_start | date | |
| collective_agreement_id | uuid? | Convenção colectiva aplicável |

### Employee (trabalhador)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | |
| company_id | uuid | |
| employee_number | varchar | N.º mecanográfico, único por empresa |
| full_name | text | |
| gender | enum | |
| birth_date | date | |
| marital_status | enum | |
| nationality | char(2) | ISO 3166 |
| id_document_type | enum | `BI`, `PASSPORT`, `RESIDENT_CARD` |
| id_document_number | varchar | Validação conforme tipo |
| id_document_expiry | date | Alerta de expiração |
| nif | varchar | |
| social_security_number | varchar | |
| phone | varchar | E.164 (`+2449XXXXXXXX`) |
| email | citext? | |
| address | jsonb | |
| hire_date | date | |
| seniority_date | date | Pode diferir da admissão (readmissões, transmissão de empresa) |
| status | enum | `ACTIVE`, `SUSPENDED`, `ON_LEAVE`, `TERMINATED` |
| user_id | uuid? | Ligação à conta do portal |
| sensitive | jsonb (cifrado) | Dados de saúde, deficiência |

### EmploymentContract (contrato)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | |
| employee_id | uuid | |
| contract_type | enum | `INDEFINITE`, `FIXED_TERM`, `UNCERTAIN_TERM`, `PART_TIME`, `INTERNSHIP`, `TEMPORARY`, `NON_RESIDENT`, ... |
| start_date / end_date | date | `end_date` nulo nos contratos por tempo indeterminado |
| probation_end_date | date? | |
| renewals_count | int | |
| job_position_id | uuid | |
| job_category_id | uuid | |
| salary_scale_id | uuid? | Escalão da tabela salarial |
| base_salary | numeric(18,2) | |
| currency | char(3) | |
| weekly_hours | numeric(5,2) | 44 por omissão |
| work_schedule_id | uuid | |
| payment_method | enum | `BANK_TRANSFER`, `CASH`, `MOBILE_WALLET`, `CHEQUE` |
| termination_date | date? | |
| termination_reason | enum? | |
| document_id | uuid? | PDF assinado |

### PayItem (rubrica)

Ver os atributos completos em [04 — 4.2](./04-folha-de-pagamento.md#42-atributos-de-uma-rubrica).

### LegalTable (tabela legal versionada)

| Campo | Tipo | Notas |
| --- | --- | --- |
| id | uuid | |
| tenant_id | uuid? | Nulo = tabela global mantida pela pagador.ao |
| kind | enum | `IRT_GROUP_A`, `SOCIAL_SECURITY`, `MINIMUM_WAGE`, `IRT_EXEMPTIONS`, `OVERTIME_RATES`, `HOLIDAYS`, `EXCHANGE_RATE` |
| effective_from / effective_to | date | |
| legal_reference | text | Ex.: "Lei n.º 28/20, de 22 de Julho" |
| data | jsonb | Ex.: lista de escalões `{from, to, fixed, rate, excess_over}` |
| approved_by / approved_at | | Duplo controlo na publicação |

### PayrollPeriod, PayrollRun, Payslip

| Entidade | Campos principais |
| --- | --- |
| PayrollPeriod | company_id, year, month, start_date, end_date, payment_date, attendance_closed_at, status |
| PayrollRun | period_id, run_type (`REGULAR`, `HOLIDAY_ALLOWANCE`, `CHRISTMAS_ALLOWANCE`, `BONUS`, `RETRO`, `SUPPLEMENTARY`, `FINAL_SETTLEMENT`), status, calculated_at, approved_by, approved_at, closed_at, legal_tables_snapshot |
| Payslip | run_id, employee_id, contract_id, gross, ss_base, ss_employee, ss_employer, irt_taxable, irt_base, irt, total_deductions, net, employer_cost, currency, exchange_rate, calculation_trace (jsonb) |
| PayslipLine | payslip_id, pay_item_id, quantity, rate, amount, taxable_amount, ss_amount, source (`CONTRACT`, `VARIABLE`, `FORMULA`, `ATTENDANCE`, `LOAN`, ...), reference_period |

### Assiduidade

| Entidade | Campos principais |
| --- | --- |
| WorkSchedule | name, type (`FIXED`, `FLEXIBLE`, `SHIFT`, `ROTATION`), weekly_hours, days (jsonb), tolerance_minutes |
| Shift / ShiftAssignment | start, end, break, employee_id, date |
| AttendanceRecord | employee_id, timestamp, type (`IN`, `OUT`), source (`WEB`, `KIOSK`, `BIOMETRIC`, `MANUAL`, `API`), geo (lat/lng), user_agent, photo_id, idempotency_key |
| AttendanceDay | employee_id, date, scheduled_minutes, worked_minutes, late_minutes, overtime_minutes, night_minutes, absence_id, status |
| OvertimeRequest | employee_id, date, minutes, type, reason, status |
| LeaveBalance | employee_id, year, entitled_days, carried_over, taken, scheduled |
| LeaveRequest / Absence | employee_id, type, reason_code, start, end, days, justified, paid, document_id, status |

### Pagamentos

| Entidade | Campos principais |
| --- | --- |
| BankAccount | employee_id, bank_code, iban, holder_name, split_percent, is_primary, validated_at |
| PaymentBatch | run_id, bank_code, file_format, total_amount, status, prepared_by, approved_by, file_id |
| PaymentInstruction | batch_id, payslip_id, bank_account_id, amount, status (`PENDING`, `SENT`, `PAID`, `REJECTED`), rejection_reason |

### AuditLog

| Campo | Tipo |
| --- | --- |
| id | uuid |
| tenant_id | uuid |
| actor_user_id | uuid |
| action | text (ex.: `payroll_run.approve`) |
| entity_type / entity_id | text / uuid |
| before / after | jsonb |
| ip / user_agent | text |
| occurred_at | timestamptz |

Tabela apenas de inserção; protegida contra `UPDATE`/`DELETE` e com encadeamento de hash para detectar adulterações.

## 6.4 Tabelas de referência

| Tabela | Conteúdo |
| --- | --- |
| provinces / municipalities | 21 províncias e respectivos municípios |
| banks | Código, nome, BIC/SWIFT, formato de ficheiro suportado |
| countries / nationalities | ISO 3166 |
| currencies | ISO 4217 |
| absence_reasons | Catálogo configurável de motivos de falta |
| leave_types | Tipos de licença |
| termination_reasons | Formas de cessação |
| education_levels | Graus académicos |
| relationship_types | Graus de parentesco |
