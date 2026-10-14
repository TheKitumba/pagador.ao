# 08 — Requisitos não funcionais

## 8.1 Segurança

| ID | Requisito |
| --- | --- |
| RNF-SEG-01 | Comunicações cifradas com TLS 1.2 ou superior; HSTS activo. |
| RNF-SEG-02 | Dados em repouso cifrados (AES-256); campos sensíveis (salário, IBAN, saúde) com cifra adicional ao nível da aplicação e gestão de chaves num KMS. |
| RNF-SEG-03 | Palavras-passe guardadas com Argon2id. |
| RNF-SEG-04 | 2FA obrigatório para papéis com acesso a dados financeiros. |
| RNF-SEG-05 | Isolamento entre clientes (tenants) garantido na base de dados e testado automaticamente. |
| RNF-SEG-06 | Protecção contra as vulnerabilidades do OWASP Top 10 (injecção, XSS, CSRF, controlo de acessos, etc.). |
| RNF-SEG-07 | Testes de intrusão por entidade independente pelo menos uma vez por ano e antes de cada lançamento principal. |
| RNF-SEG-08 | Registo de auditoria imutável (ver M25), conservado pelo prazo legal. |
| RNF-SEG-09 | Limitação de pedidos e protecção contra força bruta nos pontos de autenticação. |
| RNF-SEG-10 | Gestão de segredos fora do código; rotação periódica. |
| RNF-SEG-11 | Cópias de segurança diárias cifradas, com retenção de 30 dias e teste de reposição mensal. |
| RNF-SEG-12 | Plano de resposta a incidentes, com notificação aos clientes e à APD nos prazos aplicáveis. |

## 8.2 Privacidade (Lei n.º 22/11)

- Registo dos tratamentos de dados por finalidade.
- Consentimentos registados e revogáveis (biometria, fotografia no ponto, WhatsApp, banco de talentos).
- Mascaramento de dados sensíveis nas listagens (ex.: IBAN `AO06 •••• •••• 1234`).
- Exportação dos dados pessoais a pedido do titular.
- Anonimização de candidatos e ex-trabalhadores após o prazo de conservação.
- Acesso da equipa de suporte a dados de clientes apenas com autorização explícita, por tempo limitado e registado.

## 8.3 Desempenho e escalabilidade

| ID | Métrica | Meta |
| --- | --- | --- |
| RNF-DES-01 | Tempo de resposta das páginas (p95) | < 1 s em rede 4G |
| RNF-DES-02 | Tempo de resposta da API (p95) | < 300 ms nas leituras simples |
| RNF-DES-03 | Cálculo da folha | 1 000 trabalhadores em menos de 60 s |
| RNF-DES-04 | Geração de recibos em PDF | 1 000 recibos em menos de 3 minutos (processamento em segundo plano) |
| RNF-DES-05 | Escala | 10 000 empresas e 1 000 000 de trabalhadores sem alteração de arquitectura |
| RNF-DES-06 | Pico de utilização | Suportar o pico dos dias 20–30 de cada mês e de Dezembro |

## 8.4 Disponibilidade e continuidade

- Disponibilidade mensal de **99,9%** (plano Empresarial: 99,95%).
- Janelas de manutenção comunicadas com antecedência e fora do período de fecho de folhas.
- RPO (perda máxima de dados): 15 minutos. RTO (tempo de reposição): 4 horas.
- Réplica em região secundária.
- Página pública de estado do serviço.

## 8.5 Conectividade e condições locais

- Nesta fase não há aplicação móvel nativa: o portal do trabalhador e o ponto funcionam no **navegador do telemóvel**. O registo de ponto offline fica para a futura aplicação móvel.
- Páginas leves: bundle inicial inferior a 200 KB comprimido, imagens optimizadas, Server Components para reduzir o JavaScript enviado ao cliente, carregamento progressivo (streaming e `loading.tsx`).
- Tolerância a ligações lentas e intermitentes: novas tentativas automáticas, envios idempotentes (uma marcação de ponto repetida não é duplicada), mensagem clara quando não há rede.
- Suporte aos navegadores de telemóveis Android de gama baixa (Chrome em Android 9 ou superior, 2 GB de RAM) e às duas últimas versões do Safari em iOS.
- Consumo reduzido de dados móveis (modo de poupança de dados).

## 8.6 Usabilidade e acessibilidade

- Conformidade com **WCAG 2.2 nível AA**.
- Design segundo as **Apple Human Interface Guidelines**, com modo claro e escuro e respeito pela preferência do sistema.
- Tipografia Nunito; tamanho mínimo de texto de 14 px; alvos de toque de pelo menos 44 × 44 px.
- Navegação completa por teclado; leitores de ecrã suportados.
- Linguagem clara, sem jargão técnico desnecessário; ajuda contextual nos ecrãs de cálculo.
- Responsivo: computador, tablet e telemóvel.
- Estados vazios, de carregamento e de erro concebidos para todos os ecrãs.

## 8.7 Localização

- Idioma principal: **português de Angola (`pt-AO`)**. Inglês (`en`) para expatriados e grupos internacionais, numa fase posterior.
- Moeda: Kwanza, formato `1 250 000,00 Kz`; separador de milhares com espaço fino, vírgula decimal.
- Datas `DD/MM/AAAA`, semana a começar à segunda-feira, fuso `Africa/Luanda`.
- Telefones no formato `+244 9XX XXX XXX`.
- Terminologia local: "trabalhador", "entidade empregadora", "vencimento", "subsídio", "Bilhete de Identidade", "NIF", "província", "município", "bairro".
- Todos os textos da interface externalizados em ficheiros de tradução (nada codificado nos componentes).

## 8.8 Qualidade e testes

- Cobertura de testes unitários de **pelo menos 95% no motor de cálculo** da folha, incluindo todos os limites de escalões do IRT e casos de fronteira.
- Conjunto de **casos de referência validados por um técnico de contas**, executado em cada alteração do motor ou das tabelas legais.
- Testes end-to-end dos fluxos críticos: admissão → folha → pagamento → mapas fiscais.
- Testes de regressão visual dos recibos e documentos.
- Testes de carga antes de cada fim de mês com alterações relevantes.

## 8.9 Observabilidade

- Logs estruturados, sem dados pessoais em claro.
- Métricas e rastreio distribuído (OpenTelemetry).
- Alertas sobre erros, latência e falhas de tarefas em segundo plano (geração de recibos, envio de e-mails).
- Painel de saúde por cliente para a equipa de suporte.

## 8.10 Alojamento e residência de dados

- Preferência por alojamento em Angola ou em região com baixa latência para Luanda, de acordo com os requisitos de transferência internacional de dados da Lei n.º 22/11 e com eventuais exigências de clientes do sector público, bancário ou petrolífero.
- Opção de **instalação dedicada** (single-tenant ou on-premises) para grandes clientes com requisitos regulatórios próprios.
