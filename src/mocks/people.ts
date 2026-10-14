/**
 * Temporary fixtures used while the API endpoints are not available.
 * Replace each import with the corresponding hook from `@/queries/<domain>`.
 */

export const company = {
  name: "Kianda Logística, Lda.",
  shortName: "Kianda Logística",
  nif: "5417089621",
  plan: "Profissional",
};

export const companies = [
  company,
  { name: "Kianda Serviços Portuários, S.A.", shortName: "Kianda Portuária", nif: "5000348812", plan: "Profissional" },
];

export const currentUser = {
  name: "Isabel Neto",
  email: "isabel.neto@kianda.co.ao",
  role: "Gestora de RH",
};

export type EmployeeStatus = "active" | "probation" | "leave" | "terminated";

export interface Employee {
  id: string;
  number: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  establishment: string;
  manager: string | null;
  contractType: string;
  status: EmployeeStatus;
  hireDate: string;
  birthDate: string;
  baseSalary: number;
  nif: string;
  socialSecurity: string;
  bank: string;
  iban: string;
}

export const establishments = ["Sede — Talatona, Luanda", "Armazém do Lobito, Benguela", "Delegação do Huambo"];

export const departments = [
  { name: "Operações", head: "Domingos Cassoma", headcount: 112, costCenter: "CC-100" },
  { name: "Logística e Armazém", head: "Feliciano Lukamba", headcount: 64, costCenter: "CC-200" },
  { name: "Finanças", head: "Graça Mbemba", headcount: 14, costCenter: "CC-300" },
  { name: "Recursos Humanos", head: "Isabel Neto", headcount: 9, costCenter: "CC-400" },
  { name: "Comercial", head: "Kátia Sebastião", headcount: 31, costCenter: "CC-500" },
  { name: "Tecnologia", head: "Osvaldo Chipenda", headcount: 18, costCenter: "CC-600" },
];

export const employees: Employee[] = [
  {
    id: "emp-001",
    number: "0001",
    name: "Ana Mateus",
    email: "ana.mateus@kianda.co.ao",
    phone: "+244 923 456 781",
    position: "Técnica de Contabilidade",
    department: "Finanças",
    establishment: "Sede — Talatona, Luanda",
    manager: "Graça Mbemba",
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2019-03-04",
    birthDate: "1991-10-16",
    baseSalary: 300000,
    nif: "004512378LA041",
    socialSecurity: "1209 3345 21",
    bank: "BFA",
    iban: "AO06 0006 0000 4512 3781 0118 7",
  },
  {
    id: "emp-002",
    number: "0002",
    name: "Domingos Cassoma",
    email: "domingos.cassoma@kianda.co.ao",
    phone: "+244 912 334 120",
    position: "Director de Operações",
    department: "Operações",
    establishment: "Sede — Talatona, Luanda",
    manager: null,
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2015-01-12",
    birthDate: "1979-04-02",
    baseSalary: 1450000,
    nif: "001233498LA032",
    socialSecurity: "0988 1123 77",
    bank: "BAI",
    iban: "AO06 0040 0000 1233 4981 0197 2",
  },
  {
    id: "emp-003",
    number: "0003",
    name: "Edvânia Tavares",
    email: "edvania.tavares@kianda.co.ao",
    phone: "+244 934 210 554",
    position: "Analista de Recursos Humanos",
    department: "Recursos Humanos",
    establishment: "Sede — Talatona, Luanda",
    manager: "Isabel Neto",
    contractType: "Por tempo determinado",
    status: "probation",
    hireDate: "2026-08-03",
    birthDate: "1997-06-21",
    baseSalary: 420000,
    nif: "006781234LA045",
    socialSecurity: "1455 0921 03",
    bank: "BIC",
    iban: "AO06 0051 0000 6781 2341 0144 9",
  },
  {
    id: "emp-004",
    number: "0004",
    name: "Feliciano Lukamba",
    email: "feliciano.lukamba@kianda.co.ao",
    phone: "+244 923 778 410",
    position: "Chefe de Armazém",
    department: "Logística e Armazém",
    establishment: "Armazém do Lobito, Benguela",
    manager: "Domingos Cassoma",
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2017-05-22",
    birthDate: "1984-11-30",
    baseSalary: 780000,
    nif: "002198776BG012",
    socialSecurity: "1011 5532 88",
    bank: "BFA",
    iban: "AO06 0006 0000 2198 7761 0122 4",
  },
  {
    id: "emp-005",
    number: "0005",
    name: "Graça Mbemba",
    email: "graca.mbemba@kianda.co.ao",
    phone: "+244 912 009 871",
    position: "Directora Financeira",
    department: "Finanças",
    establishment: "Sede — Talatona, Luanda",
    manager: null,
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2016-09-01",
    birthDate: "1981-02-14",
    baseSalary: 1380000,
    nif: "001876543LA028",
    socialSecurity: "0999 4410 12",
    bank: "Standard Bank",
    iban: "AO06 0060 0000 1876 5431 0155 6",
  },
  {
    id: "emp-006",
    number: "0006",
    name: "Hélder Kiala",
    email: "helder.kiala@kianda.co.ao",
    phone: "+244 945 120 337",
    position: "Motorista de Pesados",
    department: "Operações",
    establishment: "Armazém do Lobito, Benguela",
    manager: "Feliciano Lukamba",
    contractType: "Por tempo indeterminado",
    status: "leave",
    hireDate: "2020-02-17",
    birthDate: "1988-07-08",
    baseSalary: 260000,
    nif: "005543219BG019",
    socialSecurity: "1288 7731 40",
    bank: "BAI",
    iban: "AO06 0040 0000 5543 2191 0166 1",
  },
  {
    id: "emp-007",
    number: "0007",
    name: "Kátia Sebastião",
    email: "katia.sebastiao@kianda.co.ao",
    phone: "+244 923 667 902",
    position: "Directora Comercial",
    department: "Comercial",
    establishment: "Sede — Talatona, Luanda",
    manager: null,
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2018-04-09",
    birthDate: "1986-12-03",
    baseSalary: 1250000,
    nif: "003345671LA036",
    socialSecurity: "1102 9984 51",
    bank: "BFA",
    iban: "AO06 0006 0000 3345 6711 0177 3",
  },
  {
    id: "emp-008",
    number: "0008",
    name: "Lukeny Bamba",
    email: "lukeny.bamba@kianda.co.ao",
    phone: "+244 931 445 216",
    position: "Operador de Empilhadora",
    department: "Logística e Armazém",
    establishment: "Armazém do Lobito, Benguela",
    manager: "Feliciano Lukamba",
    contractType: "Por tempo determinado",
    status: "active",
    hireDate: "2025-11-03",
    birthDate: "1999-03-19",
    baseSalary: 210000,
    nif: "007765412BG022",
    socialSecurity: "1502 3367 09",
    bank: "BIC",
    iban: "AO06 0051 0000 7765 4121 0188 5",
  },
  {
    id: "emp-009",
    number: "0009",
    name: "Manuel Kalandula",
    email: "manuel.kalandula@kianda.co.ao",
    phone: "+244 924 880 113",
    position: "Técnico de Manutenção",
    department: "Operações",
    establishment: "Delegação do Huambo",
    manager: "Domingos Cassoma",
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2021-07-05",
    birthDate: "1990-09-25",
    baseSalary: 350000,
    nif: "005098712HB011",
    socialSecurity: "1355 4410 28",
    bank: "Banco Sol",
    iban: "AO06 0044 0000 5098 7121 0199 8",
  },
  {
    id: "emp-010",
    number: "0010",
    name: "Nádia Paím",
    email: "nadia.paim@kianda.co.ao",
    phone: "+244 913 220 678",
    position: "Gestora de Clientes",
    department: "Comercial",
    establishment: "Sede — Talatona, Luanda",
    manager: "Kátia Sebastião",
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2022-02-14",
    birthDate: "1994-10-20",
    baseSalary: 480000,
    nif: "006123987LA044",
    socialSecurity: "1411 2290 65",
    bank: "BFA",
    iban: "AO06 0006 0000 6123 9871 0211 0",
  },
  {
    id: "emp-011",
    number: "0011",
    name: "Osvaldo Chipenda",
    email: "osvaldo.chipenda@kianda.co.ao",
    phone: "+244 927 556 340",
    position: "Responsável de Sistemas",
    department: "Tecnologia",
    establishment: "Sede — Talatona, Luanda",
    manager: null,
    contractType: "Por tempo indeterminado",
    status: "active",
    hireDate: "2019-10-01",
    birthDate: "1987-05-11",
    baseSalary: 1100000,
    nif: "004009876LA039",
    socialSecurity: "1188 6620 14",
    bank: "BAI",
    iban: "AO06 0040 0000 4009 8761 0222 2",
  },
  {
    id: "emp-012",
    number: "0012",
    name: "Rui Kapinga",
    email: "rui.kapinga@kianda.co.ao",
    phone: "+244 935 101 772",
    position: "Assistente Administrativo",
    department: "Recursos Humanos",
    establishment: "Sede — Talatona, Luanda",
    manager: "Isabel Neto",
    contractType: "Por tempo determinado",
    status: "terminated",
    hireDate: "2024-03-18",
    birthDate: "1996-01-09",
    baseSalary: 230000,
    nif: "007001234LA047",
    socialSecurity: "1477 8810 33",
    bank: "BFA",
    iban: "AO06 0006 0000 7001 2341 0233 4",
  },
];

export function findEmployee(id: string) {
  return employees.find((employee) => employee.id === id);
}

export const employeeStatusLabel: Record<EmployeeStatus, string> = {
  active: "Activo",
  probation: "Período experimental",
  leave: "De licença",
  terminated: "Cessado",
};

export const positions = [
  { title: "Director de Operações", department: "Operações", grade: "Direcção", occupied: 1 },
  { title: "Motorista de Pesados", department: "Operações", grade: "Operacional", occupied: 46 },
  { title: "Técnico de Manutenção", department: "Operações", grade: "Técnico", occupied: 12 },
  { title: "Chefe de Armazém", department: "Logística e Armazém", grade: "Chefia", occupied: 3 },
  { title: "Operador de Empilhadora", department: "Logística e Armazém", grade: "Operacional", occupied: 38 },
  { title: "Técnica de Contabilidade", department: "Finanças", grade: "Técnico", occupied: 6 },
  { title: "Analista de Recursos Humanos", department: "Recursos Humanos", grade: "Técnico", occupied: 4 },
  { title: "Gestora de Clientes", department: "Comercial", grade: "Técnico", occupied: 11 },
];

export type ContractAlert = "ending" | "probation" | "renewal";

export const contractAlerts = [
  { employeeId: "emp-008", type: "ending" as ContractAlert, contract: "Por tempo determinado", endDate: "2026-11-02", daysLeft: 19 },
  { employeeId: "emp-003", type: "probation" as ContractAlert, contract: "Período experimental", endDate: "2026-11-01", daysLeft: 18 },
  { employeeId: "emp-012", type: "ending" as ContractAlert, contract: "Por tempo determinado", endDate: "2026-10-31", daysLeft: 17 },
  { employeeId: "emp-006", type: "renewal" as ContractAlert, contract: "Adenda salarial", endDate: "2026-12-31", daysLeft: 78 },
];

export const jobOpenings = [
  { id: "job-01", title: "Motorista de Pesados", location: "Lobito, Benguela", type: "Tempo inteiro", candidates: 48, stage: "Triagem", openedAt: "2026-09-22", status: "open" as const },
  { id: "job-02", title: "Técnico de Contabilidade Sénior", location: "Talatona, Luanda", type: "Tempo inteiro", candidates: 23, stage: "Entrevistas", openedAt: "2026-09-08", status: "open" as const },
  { id: "job-03", title: "Estagiário de Logística", location: "Huambo", type: "Estágio", candidates: 71, stage: "Teste", openedAt: "2026-08-30", status: "open" as const },
  { id: "job-04", title: "Gestor de Frota", location: "Talatona, Luanda", type: "Tempo inteiro", candidates: 12, stage: "Proposta", openedAt: "2026-08-12", status: "paused" as const },
];

export const pipelineStages = ["Candidatura", "Triagem", "Entrevista", "Teste", "Proposta", "Contratado"] as const;

export const candidates = [
  { name: "Adilson Gaspar", job: "Motorista de Pesados", stage: "Candidatura", score: 3, appliedAt: "2026-10-12" },
  { name: "Benvinda Lussati", job: "Técnico de Contabilidade Sénior", stage: "Entrevista", score: 4, appliedAt: "2026-09-29" },
  { name: "Celso Mavinga", job: "Motorista de Pesados", stage: "Triagem", score: 4, appliedAt: "2026-10-03" },
  { name: "Dalva Quintas", job: "Estagiário de Logística", stage: "Teste", score: 5, appliedAt: "2026-09-15" },
  { name: "Elias Ngunza", job: "Gestor de Frota", stage: "Proposta", score: 5, appliedAt: "2026-08-20" },
  { name: "Fátima Kambundo", job: "Técnico de Contabilidade Sénior", stage: "Triagem", score: 3, appliedAt: "2026-10-08" },
  { name: "Gelson Tchiwale", job: "Estagiário de Logística", stage: "Entrevista", score: 4, appliedAt: "2026-09-18" },
  { name: "Helena Mufuma", job: "Motorista de Pesados", stage: "Contratado", score: 5, appliedAt: "2026-09-25" },
];
