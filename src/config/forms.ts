import type { FieldConfig } from "@/components/common/form-dialog";
import { departments, establishments, positions } from "@/mocks/people";

/** Create / edit forms used across the app. Field configs are serializable, so server pages can use them. */
export interface FormSpec {
  title: string;
  description?: string;
  fields: FieldConfig[];
  submitLabel: string;
  successTitle: string;
  successDescription?: string;
}

const departmentNames = departments.map((department) => department.name);

export const forms = {
  orgUnit: {
    title: "Nova unidade",
    description: "Departamento, estabelecimento ou centro de custo",
    submitLabel: "Criar unidade",
    successTitle: "Unidade criada",
    fields: [
      { name: "kind", label: "Tipo", type: "select", required: true, options: ["Departamento", "Estabelecimento", "Centro de custo"] },
      { name: "name", label: "Nome", required: true },
      { name: "parent", label: "Depende de", type: "select", options: ["Direcção Geral", ...departmentNames] },
      { name: "head", label: "Responsável", type: "employee" },
      { name: "costCenter", label: "Código do centro de custo", placeholder: "CC-700" },
    ],
  },
  contract: {
    title: "Novo contrato",
    description: "O contrato fica em rascunho até ser assinado pelas duas partes",
    submitLabel: "Criar contrato",
    successTitle: "Contrato criado",
    successDescription: "Pronto a imprimir e assinar.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "type", label: "Tipo", type: "select", required: true, options: ["Por tempo indeterminado", "Por tempo determinado", "Estágio profissional", "Trabalhador estrangeiro"] },
      { name: "position", label: "Cargo", type: "select", required: true, options: positions.map((p) => p.title) },
      { name: "start", label: "Início", type: "date", required: true },
      { name: "end", label: "Fim (se a termo)", type: "date" },
      { name: "salary", label: "Vencimento base (Kz)", type: "money", required: true, min: 1 },
      { name: "probation", label: "Período experimental (dias)", type: "number", defaultValue: 60 },
    ],
  },
  renewContract: {
    title: "Renovar contrato",
    submitLabel: "Renovar",
    successTitle: "Contrato renovado",
    successDescription: "A adenda foi gerada e o trabalhador será notificado.",
    fields: [
      { name: "end", label: "Nova data de termo", type: "date", required: true },
      { name: "salary", label: "Novo vencimento base (Kz)", type: "money", description: "Deixe vazio para manter o actual." },
      { name: "notes", label: "Observações", type: "textarea" },
    ],
  },
  job: {
    title: "Nova vaga",
    description: "Publicada na página de carreiras depois de aprovada",
    submitLabel: "Criar vaga",
    successTitle: "Vaga criada",
    successDescription: "Enviada para aprovação do Gestor de RH.",
    fields: [
      { name: "title", label: "Título", required: true, full: true },
      { name: "department", label: "Departamento", type: "select", required: true, options: departmentNames },
      { name: "location", label: "Local", type: "select", required: true, options: establishments },
      { name: "type", label: "Regime", type: "select", required: true, options: ["Tempo inteiro", "Tempo parcial", "Estágio"] },
      { name: "openings", label: "N.º de vagas", type: "number", defaultValue: 1, min: 1 },
      { name: "description", label: "Descrição e requisitos", type: "textarea", required: true },
      { name: "publish", label: "Publicar na página de carreiras", type: "switch", defaultValue: true },
    ],
  },
  schedule: {
    title: "Novo horário",
    submitLabel: "Criar horário",
    successTitle: "Horário criado",
    fields: [
      { name: "name", label: "Nome", required: true, full: true },
      { name: "start", label: "Entrada", type: "text", required: true, placeholder: "08:00" },
      { name: "end", label: "Saída", type: "text", required: true, placeholder: "17:00" },
      { name: "days", label: "Dias", type: "select", required: true, options: ["Segunda a sexta", "Segunda a sábado", "Escala rotativa"] },
      { name: "weeklyHours", label: "Horas por semana", type: "number", required: true, defaultValue: 44, min: 1 },
    ],
  },
  leave: {
    title: "Registar ausência",
    description: "Férias, faltas e licenças seguem o fluxo de aprovação configurado",
    submitLabel: "Registar",
    successTitle: "Ausência registada",
    successDescription: "Enviada para aprovação da chefia directa.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "type", label: "Tipo", type: "select", required: true, full: true, options: ["Férias", "Falta justificada — doença", "Falta justificada — casamento", "Falta justificada — luto", "Licença de maternidade", "Licença de paternidade", "Falta injustificada"] },
      { name: "start", label: "Início", type: "date", required: true },
      { name: "end", label: "Fim", type: "date", required: true },
      { name: "document", label: "Justificativo (opcional)", type: "file", accept: "application/pdf,image/*" },
      { name: "notes", label: "Observações", type: "textarea" },
    ],
  },
  overtime: {
    title: "Registar horas extra",
    submitLabel: "Registar",
    successTitle: "Horas extra registadas",
    successDescription: "Enviadas para aprovação.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "date", label: "Dia", type: "date", required: true },
      { name: "hours", label: "Horas", type: "number", required: true, min: 1 },
      { name: "kind", label: "Tipo", type: "select", required: true, full: true, options: ["Dia útil (+50%)", "Descanso semanal (+100%)", "Feriado (+100%)"] },
      { name: "reason", label: "Motivo", type: "textarea", required: true },
    ],
  },
  timesheet: {
    title: "Nova folha de horas",
    submitLabel: "Submeter",
    successTitle: "Folha de horas submetida",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "week", label: "Semana a começar em", type: "date", required: true },
      { name: "project", label: "Projecto", required: true },
      { name: "hours", label: "Horas", type: "number", required: true, min: 1 },
      { name: "notes", label: "Notas", type: "textarea" },
    ],
  },
  payrollRun: {
    title: "Novo processamento",
    description: "Cria a pré-folha com os trabalhadores activos no período",
    submitLabel: "Criar processamento",
    successTitle: "Processamento criado",
    successDescription: "Em rascunho. Pode lançar as variáveis do mês.",
    fields: [
      { name: "type", label: "Tipo", type: "select", required: true, full: true, options: ["Mensal", "Subsídio de férias", "Subsídio de Natal", "Complementar"] },
      { name: "period", label: "Mês de referência", type: "date", required: true },
      { name: "paymentDate", label: "Data de pagamento", type: "date", required: true },
      { name: "scope", label: "Abrangência", type: "select", required: true, full: true, options: ["Todos os trabalhadores", ...establishments] },
    ],
  },
  benefit: {
    title: "Novo benefício",
    submitLabel: "Criar benefício",
    successTitle: "Benefício criado",
    fields: [
      { name: "name", label: "Nome", required: true, full: true },
      { name: "type", label: "Tipo", type: "select", required: true, options: ["Subsídio", "Seguro", "Benefício em espécie"] },
      { name: "amount", label: "Valor mensal (Kz)", type: "money" },
      { name: "irt", label: "Incide IRT", type: "switch", defaultValue: true },
      { name: "ss", label: "Incide Segurança Social", type: "switch", defaultValue: true },
    ],
  },
  advance: {
    title: "Adiantamento ou empréstimo",
    description: "As prestações respeitam o limite impenhorável do vencimento",
    submitLabel: "Registar",
    successTitle: "Pedido registado",
    successDescription: "Enviado para aprovação: chefia → Gestor de RH → Aprovador financeiro.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "type", label: "Tipo", type: "select", required: true, options: ["Adiantamento salarial", "Empréstimo", "Penhora judicial"] },
      { name: "amount", label: "Montante (Kz)", type: "money", required: true, min: 1 },
      { name: "installments", label: "N.º de prestações", type: "number", required: true, defaultValue: 1, min: 1 },
      { name: "firstMonth", label: "Primeiro desconto", type: "date", required: true },
      { name: "notes", label: "Justificação", type: "textarea" },
    ],
  },
  reimbursement: {
    title: "Pedido de reembolso",
    submitLabel: "Submeter pedido",
    successTitle: "Pedido submetido",
    successDescription: "Enviado para aprovação: chefia → Finanças.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "category", label: "Categoria", type: "select", required: true, options: ["Deslocação", "Ajudas de custo", "Combustível", "Material", "Representação"] },
      { name: "date", label: "Data da despesa", type: "date", required: true },
      { name: "amount", label: "Valor (Kz)", type: "money", required: true, min: 1 },
      { name: "description", label: "Descrição", required: true },
      { name: "receipt", label: "Comprovativo", type: "file", required: true, accept: "application/pdf,image/*" },
    ],
  },
  taxFiling: {
    title: "Gerar mapas fiscais",
    submitLabel: "Gerar",
    successTitle: "Mapas gerados",
    successDescription: "Ficheiros prontos a descarregar e submeter.",
    fields: [
      { name: "period", label: "Mês de referência", type: "date", required: true },
      { name: "authority", label: "Obrigação", type: "select", required: true, options: ["IRT retido (AGT)", "Folha de remunerações (INSS)", "Retenção na fonte — prestadores (AGT)", "Todas"] },
    ],
  },
  termination: {
    title: "Iniciar cessação",
    description: "O acerto final de contas é calculado automaticamente",
    submitLabel: "Iniciar",
    successTitle: "Cessação iniciada",
    successDescription: "Segue para aprovação: Gestor de RH → Direcção.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "reason", label: "Motivo", type: "select", required: true, full: true, options: ["Caducidade do contrato a termo", "Rescisão por iniciativa do trabalhador", "Despedimento por justa causa", "Despedimento colectivo", "Acordo entre as partes", "Reforma"] },
      { name: "noticeDate", label: "Data da comunicação", type: "date", required: true },
      { name: "lastDay", label: "Último dia de trabalho", type: "date", required: true },
      { name: "notes", label: "Observações", type: "textarea" },
    ],
  },
  reviewCycle: {
    title: "Novo ciclo de avaliação",
    submitLabel: "Criar ciclo",
    successTitle: "Ciclo criado",
    successDescription: "Os participantes são notificados na data de início.",
    fields: [
      { name: "name", label: "Nome", required: true, full: true },
      { name: "start", label: "Início", type: "date", required: true },
      { name: "end", label: "Fim", type: "date", required: true },
      { name: "scope", label: "Participantes", type: "select", required: true, full: true, options: ["Todos os trabalhadores", ...departmentNames] },
      { name: "self", label: "Incluir auto-avaliação", type: "switch", defaultValue: true },
    ],
  },
  feedback: {
    title: "Dar feedback",
    submitLabel: "Enviar",
    successTitle: "Feedback enviado",
    fields: [
      { name: "to", label: "Para", type: "employee", required: true, full: true },
      { name: "kind", label: "Tipo", type: "select", required: true, options: ["Reconhecimento", "Sugestão"] },
      { name: "value", label: "Valor da empresa", type: "select", options: ["Rigor", "Segurança", "Foco no cliente", "Espírito de equipa"] },
      { name: "message", label: "Mensagem", type: "textarea", required: true },
      { name: "public", label: "Visível para a equipa", type: "switch", defaultValue: true },
    ],
  },
  training: {
    title: "Nova acção de formação",
    submitLabel: "Criar acção",
    successTitle: "Acção de formação criada",
    fields: [
      { name: "title", label: "Título", required: true, full: true },
      { name: "provider", label: "Entidade formadora", required: true },
      { name: "date", label: "Data", type: "date", required: true },
      { name: "hours", label: "Horas", type: "number", required: true, min: 1 },
      { name: "seats", label: "Vagas", type: "number", required: true, min: 1 },
      { name: "mandatory", label: "Formação obrigatória", type: "switch" },
    ],
  },
  report: {
    title: "Novo relatório",
    submitLabel: "Criar relatório",
    successTitle: "Relatório criado",
    successDescription: "Disponível em Relatórios. Pode agendar o envio por e-mail.",
    fields: [
      { name: "name", label: "Nome", required: true, full: true },
      { name: "source", label: "Dados", type: "select", required: true, options: ["Trabalhadores", "Folha de pagamento", "Assiduidade", "Férias e faltas"] },
      { name: "groupBy", label: "Agrupar por", type: "select", options: ["Departamento", "Estabelecimento", "Cargo", "Mês"] },
      { name: "schedule", label: "Enviar por e-mail", type: "select", full: true, options: ["Não enviar", "Semanalmente", "Mensalmente"] },
    ],
  },
  disciplinary: {
    title: "Abrir processo disciplinar",
    description: "Dados sensíveis: visíveis apenas para quem tem permissão",
    submitLabel: "Abrir processo",
    successTitle: "Processo aberto",
    successDescription: "Os prazos legais foram adicionados ao calendário.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "date", label: "Data da infracção", type: "date", required: true },
      { name: "instructor", label: "Instrutor", type: "employee", required: true },
      { name: "facts", label: "Descrição dos factos", type: "textarea", required: true },
    ],
  },
  accident: {
    title: "Registar acidente de trabalho",
    submitLabel: "Registar",
    successTitle: "Acidente registado",
    successDescription: "Lembrete: participe à seguradora no prazo legal.",
    fields: [
      { name: "employee", label: "Trabalhador", type: "employee", required: true, full: true },
      { name: "date", label: "Data", type: "date", required: true },
      { name: "location", label: "Local", type: "select", required: true, options: establishments },
      { name: "severity", label: "Gravidade", type: "select", required: true, options: ["Ligeiro", "Moderado", "Grave"] },
      { name: "daysLost", label: "Dias de baixa previstos", type: "number", min: 0 },
      { name: "description", label: "O que aconteceu", type: "textarea", required: true },
    ],
  },
  invoice: {
    title: "Registar factura",
    submitLabel: "Registar",
    successTitle: "Factura registada",
    successDescription: "Enviada para aprovação de Finanças.",
    fields: [
      { name: "supplier", label: "Fornecedor", required: true, full: true },
      { name: "number", label: "N.º da factura", required: true },
      { name: "due", label: "Vencimento", type: "date", required: true },
      { name: "amount", label: "Valor (Kz)", type: "money", required: true, min: 1 },
      { name: "withholding", label: "Aplicar retenção na fonte (6,5%)", type: "switch", defaultValue: true },
      { name: "file", label: "Factura (PDF)", type: "file", required: true, accept: "application/pdf" },
    ],
  },
  announcement: {
    title: "Novo comunicado",
    submitLabel: "Publicar",
    successTitle: "Comunicado publicado",
    successDescription: "Enviado por e-mail e notificação no portal.",
    fields: [
      { name: "title", label: "Título", required: true, full: true },
      { name: "audience", label: "Destinatários", type: "select", required: true, full: true, options: ["Toda a empresa", ...establishments, ...departmentNames] },
      { name: "message", label: "Mensagem", type: "textarea", required: true },
      { name: "sms", label: "Enviar também por SMS", type: "switch" },
    ],
  },
  declaration: {
    title: "Emitir declaração",
    submitLabel: "Emitir",
    successTitle: "Declaração emitida",
    successDescription: "Descarregue-a no separador Documentos.",
    fields: [
      { name: "type", label: "Tipo", type: "select", required: true, full: true, options: ["Declaração de serviço", "Declaração de rendimentos", "Declaração para efeitos bancários"] },
      { name: "purpose", label: "Finalidade", required: true, full: true },
    ],
  },
  establishment: {
    title: "Editar estabelecimento",
    submitLabel: "Guardar",
    successTitle: "Estabelecimento actualizado",
    fields: [
      { name: "name", label: "Nome", required: true, full: true },
      { name: "address", label: "Morada", full: true },
      { name: "punch", label: "Ponto por geolocalização", type: "switch", defaultValue: true },
    ],
  },
  personalChange: {
    title: "Pedir alteração de dados",
    description: "Os Recursos Humanos validam o pedido antes de o aplicar",
    submitLabel: "Enviar pedido",
    successTitle: "Pedido enviado",
    fields: [
      { name: "field", label: "Dado a alterar", type: "select", required: true, full: true, options: ["Morada", "Telemóvel", "E-mail", "Estado civil", "Dependentes", "Conta bancária"] },
      { name: "value", label: "Novo valor", required: true, full: true },
      { name: "proof", label: "Comprovativo", type: "file", accept: "application/pdf,image/*" },
    ],
  },
} satisfies Record<string, FormSpec>;
