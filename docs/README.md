# Documentação do pagador.ao

**pagador.ao** — Sistema completo de gestão de recursos humanos e folha de pagamento para empresas angolanas.

Esta pasta reúne a documentação funcional e técnica do produto. Serve de referência para a equipa de produto, desenvolvimento, qualidade e para parceiros (contabilistas, consultores de RH e juristas) que validam as regras de negócio.

## Índice

| N.º | Documento | Conteúdo |
| --- | --- | --- |
| 01 | [Visão geral do produto](./01-visao-geral.md) | Missão, público-alvo, segmentos de empresa, proposta de valor e planos |
| 02 | [Enquadramento legal angolano](./02-enquadramento-legal.md) | LGT, IRT, Segurança Social, protecção de dados, obrigações declarativas |
| 03 | [Módulos funcionais](./03-modulos-funcionais.md) | Descrição detalhada de cada módulo de RH |
| 04 | [Motor da folha de pagamento](./04-folha-de-pagamento.md) | Rubricas, fórmulas, ciclo de processamento e exemplo de cálculo |
| 05 | [Perfis, permissões e fluxos de aprovação](./05-perfis-e-permissoes.md) | Papéis de utilizador, matriz de permissões, workflows |
| 06 | [Modelo de dados](./06-modelo-de-dados.md) | Entidades principais, atributos e relações |
| 07 | [Integrações](./07-integracoes.md) | Bancos, AGT, INSS, contabilidade, assiduidade biométrica, API |
| 08 | [Requisitos não funcionais](./08-requisitos-nao-funcionais.md) | Segurança, desempenho, disponibilidade, acessibilidade, localização |
| 09 | [Arquitectura técnica](./09-arquitectura-tecnica.md) | Aplicação full-stack em Next.js (interface, backend e API), worker, infra-estrutura e convenções |
| 10 | [Mapa de navegação e ecrãs](./10-mapa-de-ecras.md) | Rotas da aplicação e conteúdo de cada ecrã |
| 11 | [Roteiro de entregas](./11-roteiro.md) | Fases, MVP e prioridades |
| 12 | [Glossário](./12-glossario.md) | Termos de RH, fiscais e técnicos |

## Convenções desta documentação

- **Idioma:** português de Angola (PT-AO). Usa-se a grafia corrente em Angola (por exemplo, "acção", "efectivo", "direcção"), uma vez que o Acordo Ortográfico de 1990 não está ratificado no país.
- **Moeda:** Kwanza (AOA), representado como `Kz`. Formato: `1 250 000,00 Kz`.
- **Datas:** `DD/MM/AAAA`. Fuso horário: `Africa/Luanda` (WAT, UTC+1).
- **Valores legais:** taxas, escalões e limites citados são **valores por omissão** e devem estar sempre **parametrizados com data de vigência** no sistema. Antes de cada entrada em produção, e sempre que for publicado um novo Orçamento Geral do Estado (OGE) ou legislação laboral/fiscal, os valores devem ser validados por um técnico de contas ou jurista.
- **Palavras-chave normativas:** "deve" indica requisito obrigatório; "deveria" indica recomendação; "pode" indica funcionalidade opcional.
