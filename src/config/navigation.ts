import {
  Agreement01Icon,
  Analytics01Icon,
  BankIcon,
  Calendar03Icon,
  CheckListIcon,
  Clock01Icon,
  Coins01Icon,
  CustomerSupportIcon,
  DocumentValidationIcon,
  FileSearchIcon,
  GiftIcon,
  Home01Icon,
  Invoice03Icon,
  JusticeScale01Icon,
  Message01Icon,
  MoneyBag02Icon,
  Notification03Icon,
  Settings02Icon,
  Shield01Icon,
  SmartPhone01Icon,
  StarIcon,
  Target02Icon,
  TaskDaily01Icon,
  TimeScheduleIcon,
  UserAdd01Icon,
  UserGroupIcon,
  UserRemove01Icon,
  Building03Icon,
  BeachIcon,
  Mortarboard01Icon,
  Invoice01Icon,
  Timer02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface NavItem {
  title: string;
  href: string;
  icon: IconSvgElement;
  /** One line shown under the page title and in the command palette. */
  description: string;
  keywords?: string[];
  badge?: number;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export const primaryNav: NavItem[] = [
  {
    title: "Início",
    href: "/",
    icon: Home01Icon,
    description: "Resumo da empresa, prazos e tarefas pendentes",
    keywords: ["dashboard", "painel"],
  },
  {
    title: "Aprovações",
    href: "/approvals",
    icon: CheckListIcon,
    description: "Pedidos à espera da sua decisão",
    keywords: ["tarefas", "pedidos", "inbox"],
    badge: 7,
  },
  {
    title: "Notificações",
    href: "/notifications",
    icon: Notification03Icon,
    description: "Alertas, prazos e actividade recente",
    badge: 12,
  },
  {
    title: "Mensagens",
    href: "/messages",
    icon: Message01Icon,
    description: "Conversas e comunicados internos",
    badge: 3,
  },
  {
    title: "Calendário",
    href: "/calendar",
    icon: Calendar03Icon,
    description: "Feriados, férias, pagamentos e prazos fiscais",
  },
];

export const navGroups: NavGroup[] = [
  {
    id: "people",
    title: "Pessoas",
    items: [
      {
        title: "Trabalhadores",
        href: "/employees",
        icon: UserGroupIcon,
        description: "Dossiê digital de cada trabalhador",
        keywords: ["funcionários", "colaboradores", "pessoal"],
        badge: 248,
      },
      {
        title: "Organização",
        href: "/organization",
        icon: Building03Icon,
        description: "Estabelecimentos, departamentos, cargos e centros de custo",
        keywords: ["organograma", "estrutura"],
      },
      {
        title: "Contratos",
        href: "/contracts",
        icon: Agreement01Icon,
        description: "Contratos a terminar, períodos experimentais e renovações",
      },
      {
        title: "Recrutamento",
        href: "/recruitment",
        icon: UserAdd01Icon,
        description: "Vagas, candidatos e admissões",
        keywords: ["vagas", "candidatos", "onboarding"],
      },
    ],
  },
  {
    id: "time",
    title: "Tempo",
    items: [
      {
        title: "Presença",
        href: "/attendance",
        icon: Clock01Icon,
        description: "Marcações do dia, correcções e fecho do período",
        keywords: ["ponto", "assiduidade"],
      },
      {
        title: "Escalas",
        href: "/schedules",
        icon: TimeScheduleIcon,
        description: "Horários e escalas de turnos",
        keywords: ["turnos", "horários"],
      },
      {
        title: "Férias e faltas",
        href: "/leave",
        icon: BeachIcon,
        description: "Pedidos, saldos e mapa de férias",
        keywords: ["licenças", "ausências"],
      },
      {
        title: "Horas extra",
        href: "/overtime",
        icon: Timer02Icon,
        description: "Pedidos, aprovação e limites legais",
      },
      {
        title: "Folhas de horas",
        href: "/timesheets",
        icon: TaskDaily01Icon,
        description: "Horas por projecto, submissão e aprovação",
        keywords: ["timesheets", "planilhas"],
      },
    ],
  },
  {
    id: "pay",
    title: "Remuneração",
    items: [
      {
        title: "Folha de pagamento",
        href: "/payroll",
        icon: MoneyBag02Icon,
        description: "Processamentos mensais, recibos e aprovação",
        keywords: ["salários", "recibos", "processamento"],
      },
      {
        title: "Pagamentos",
        href: "/payments",
        icon: BankIcon,
        description: "Lotes de pagamento, ficheiros bancários e reconciliação",
        keywords: ["banco", "transferências", "iban"],
      },
      {
        title: "Benefícios",
        href: "/benefits",
        icon: GiftIcon,
        description: "Subsídios, seguros e outros benefícios",
      },
      {
        title: "Empréstimos",
        href: "/loans",
        icon: Coins01Icon,
        description: "Adiantamentos, empréstimos e penhoras",
        keywords: ["adiantamentos", "penhoras"],
      },
      {
        title: "Reembolsos",
        href: "/reimbursements",
        icon: Invoice01Icon,
        description: "Despesas, ajudas de custo e pagamento",
        keywords: ["despesas"],
      },
    ],
  },
  {
    id: "compliance",
    title: "Obrigações",
    items: [
      {
        title: "Mapas fiscais",
        href: "/tax-filings",
        icon: DocumentValidationIcon,
        description: "IRT para a AGT, folha de remunerações do INSS e calendário fiscal",
        keywords: ["agt", "inss", "irt", "impostos"],
      },
      {
        title: "Cessações",
        href: "/terminations",
        icon: UserRemove01Icon,
        description: "Saídas, acertos de contas e documentos de cessação",
        keywords: ["despedimento", "offboarding", "rescisão"],
      },
    ],
  },
  {
    id: "growth",
    title: "Desenvolvimento",
    items: [
      {
        title: "Desempenho",
        href: "/performance",
        icon: Target02Icon,
        description: "Ciclos de avaliação, objectivos e resultados",
        keywords: ["avaliação", "objectivos", "performance"],
      },
      {
        title: "Feedback",
        href: "/feedback",
        icon: StarIcon,
        description: "Feedback contínuo e reconhecimento",
      },
      {
        title: "Formação",
        href: "/training",
        icon: Mortarboard01Icon,
        description: "Plano de formação, acções e certificados",
      },
    ],
  },
  {
    id: "management",
    title: "Gestão",
    items: [
      {
        title: "Relatórios",
        href: "/reports",
        icon: Analytics01Icon,
        description: "Indicadores de RH e construtor de relatórios",
        keywords: ["analytics", "indicadores"],
      },
      {
        title: "Disciplina",
        href: "/disciplinary",
        icon: JusticeScale01Icon,
        description: "Processos disciplinares e prazos",
      },
      {
        title: "Saúde e segurança",
        href: "/safety",
        icon: Shield01Icon,
        description: "Exames médicos, acidentes e EPI",
        keywords: ["sst", "medicina do trabalho"],
      },
      {
        title: "Faturas",
        href: "/invoices",
        icon: Invoice03Icon,
        description: "Facturas de prestadores e da subscrição",
        keywords: ["prestadores", "facturação"],
      },
      {
        title: "Auditoria",
        href: "/audit",
        icon: FileSearchIcon,
        description: "Registo de todas as alterações",
        keywords: ["logs", "histórico"],
      },
    ],
  },
];

export const footerNav: NavItem[] = [
  {
    title: "Portal do trabalhador",
    href: "/portal",
    icon: SmartPhone01Icon,
    description: "Recibos, ponto e pedidos do próprio trabalhador",
    keywords: ["self-service"],
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings02Icon,
    description: "Empresa, rubricas, parâmetros legais, utilizadores e subscrição",
  },
  {
    title: "Central de ajuda",
    href: "/help",
    icon: CustomerSupportIcon,
    description: "Artigos, guias e contacto com o suporte",
    keywords: ["suporte"],
  },
];

export const allNavItems: NavItem[] = [
  ...primaryNav,
  ...navGroups.flatMap((group) => group.items),
  ...footerNav,
];

/** Most specific nav item for a pathname (e.g. /payroll/2026-10 → Folha de pagamento). */
export function findNavItem(pathname: string): NavItem | undefined {
  return allNavItems
    .filter((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function findNavGroup(pathname: string): NavGroup | undefined {
  const item = findNavItem(pathname);
  return navGroups.find((group) => group.items.some((candidate) => candidate === item));
}
