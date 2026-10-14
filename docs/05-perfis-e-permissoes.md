# 05 — Perfis, permissões e fluxos de aprovação

## 5.1 Modelo de controlo de acesso

O sistema usa **controlo de acesso baseado em papéis (RBAC)** combinado com **âmbito de dados**:

- **Papel** define *o que* o utilizador pode fazer (ex.: "aprovar folha").
- **Âmbito** define *sobre quem* (ex.: apenas a empresa X, apenas o estabelecimento de Benguela, apenas a sua equipa).
- **Permissões sensíveis** (ver salários, dados de saúde, dados bancários, processos disciplinares) são atribuídas explicitamente, mesmo a quem tem acesso ao módulo.

Um utilizador pode ter vários papéis em empresas diferentes do mesmo grupo.

## 5.2 Papéis pré-definidos

| Papel | Descrição | Âmbito típico |
| --- | --- | --- |
| Super-administrador (pagador.ao) | Equipa interna: tabelas legais globais, suporte. Sem acesso a dados de clientes salvo autorização temporária registada | Plataforma |
| Administrador da conta | Gere a subscrição, empresas, utilizadores e configurações | Conta (todas as empresas) |
| Gestor de RH | Gere todo o ciclo do trabalhador | Empresa ou grupo |
| Técnico de RH | Operações do dia-a-dia sem acesso a salários | Empresa ou estabelecimento |
| Processador salarial | Lançamentos, cálculo e revisão da folha | Empresa |
| Aprovador financeiro | Aprova folhas e lotes de pagamento | Empresa |
| Chefia directa | Aprova pedidos da equipa, avalia desempenho | Subordinados directos (e indirectos, opcional) |
| Recrutador | Vagas e candidatos | Empresa |
| Trabalhador | Portal self-service | Os próprios dados |
| Auditor / Contabilista externo | Apenas leitura de mapas, relatórios e auditoria | Empresa, com prazo de validade |

Os clientes podem criar papéis personalizados a partir das permissões granulares.

## 5.3 Matriz de permissões (resumo)

Legenda: **C** criar · **L** ler · **E** editar · **A** aprovar · **—** sem acesso · **P** apenas os próprios dados · **Eq** apenas a equipa

| Módulo / acção | Admin | Gestor RH | Técnico RH | Processador | Aprovador | Chefia | Trabalhador | Auditor |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Estrutura organizacional | CLE | CLE | L | L | L | L | L | L |
| Dados pessoais do trabalhador | CLE | CLE | CLE | L | L | L (Eq) | LE (P)* | L |
| Salário e dados bancários | L | CLE | — | L | L | — | L (P) | L |
| Dados de saúde | — | L | — | — | — | — | L (P) | — |
| Contratos | L | CLEA | CLE | L | L | — | L (P) | L |
| Assiduidade | L | CLE | CLE | L | L | LA (Eq) | C L (P) | L |
| Férias e faltas | L | CLEA | CLE | L | — | A (Eq) | C L (P) | L |
| Horas extra | L | CLEA | CLE | L | L | CA (Eq) | C L (P) | L |
| Lançamentos da folha | — | CLE | — | CLE | L | — | — | L |
| Cálculo da folha | — | L | — | CE | L | — | — | L |
| Aprovação da folha | — | — | — | — | A | — | — | L |
| Lotes de pagamento | — | L | — | C | A | — | — | L |
| Recibos | L | L | — | L | L | — | L (P) | L |
| Mapas fiscais (AGT/INSS) | L | L | — | CL | L | — | — | L |
| Desempenho | L | CLE | L | — | — | CLE (Eq) | CL (P) | — |
| Disciplina | — | CLEA | — | — | — | C (Eq) | L (P) | — |
| Relatórios | L | L | L | L | L | L (Eq) | — | L |
| Configurações e parâmetros legais | CLE | LE | — | L | — | — | — | L |
| Utilizadores e papéis | CLE | — | — | — | — | — | — | — |
| Registo de auditoria | L | L | — | — | — | — | — | L |

\* Alterações de campos críticos (dados bancários, nome, documentos) feitas pelo trabalhador ficam pendentes de validação pelo RH.

## 5.4 Segregação de funções

Regras activas por omissão (configuráveis apenas pelo administrador, com registo na auditoria):

1. Quem calcula a folha não a pode aprovar.
2. Quem gera o lote de pagamento não o pode aprovar.
3. Ninguém pode aprovar pedidos (férias, horas extra, reembolsos, alterações salariais) em seu próprio benefício.
4. Alterações de IBAN de um trabalhador nos 5 dias anteriores ao pagamento geram alerta ao aprovador financeiro.
5. Nas micro empresas com um só utilizador, as regras podem ser desactivadas, mas o sistema regista a dispensa.

## 5.5 Motor de fluxos de aprovação

Cada tipo de pedido pode ter um fluxo configurável:

```
Pedido ──► Passo 1 ──► Passo 2 ──► ... ──► Aprovado
             │            │
             ▼            ▼
          Rejeitado    Devolvido para correcção
```

Atributos de cada passo:

| Atributo | Opções |
| --- | --- |
| Aprovador | Chefia directa, chefia de nível N, papel (ex.: Gestor de RH), utilizador específico, responsável do centro de custo |
| Condição | Ex.: só se `valor > 100 000 Kz`, só se `dias > 10`, só se o departamento for X |
| Regra | Um aprovador basta / todos têm de aprovar |
| Prazo (SLA) | Horas/dias para decidir; lembrete e escalamento automático |
| Delegação | Aprovador ausente (de férias) delega noutro utilizador por um período |

### Fluxos por omissão

| Pedido | Fluxo |
| --- | --- |
| Férias | Chefia directa → Técnico de RH (registo) |
| Justificação de falta | Chefia directa → RH (validação do documento) |
| Horas extra | Chefia directa (prévia) → confirmação após realização |
| Adiantamento salarial | Chefia → Gestor de RH → Aprovador financeiro |
| Reembolso de despesas | Chefia → Finanças |
| Alteração salarial / promoção | Chefia → Gestor de RH → Direcção |
| Requisição de pessoal | Chefia → Gestor de RH → Direcção |
| Folha de pagamento | Processador → Revisor (opcional) → Aprovador financeiro |
| Lote de pagamento | Processador → Aprovador financeiro |
| Cessação de contrato | Gestor de RH → Direcção (→ Jurídico, opcional) |

## 5.6 Autenticação

- E-mail e palavra-passe, com política de complexidade e bloqueio após tentativas falhadas.
- **Autenticação de dois factores (2FA)** obrigatória para papéis com acesso a salários, pagamentos e configurações (aplicação autenticadora ou SMS).
- Entrada por **telemóvel + OTP por SMS** para trabalhadores sem e-mail.
- **SSO** (SAML 2.0 / OpenID Connect, ex.: Microsoft Entra ID, Google Workspace) no plano Empresarial.
- Sessões com expiração por inactividade; terminação remota de sessões.
- Restrição opcional por endereço IP para papéis administrativos.
