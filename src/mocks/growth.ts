export const reviewCycles = [
  { name: "Avaliação anual 2026", period: "01/11/2026 – 15/12/2026", participants: 248, completed: 0, status: "scheduled" as const },
  { name: "Fim do período experimental", period: "Contínuo", participants: 6, completed: 4, status: "active" as const },
  { name: "Avaliação semestral 2026", period: "01/06/2026 – 15/07/2026", participants: 241, completed: 236, status: "closed" as const },
];

export const goals = [
  { owner: "Domingos Cassoma", title: "Reduzir o tempo médio de entrega para 36 h", progress: 72, due: "2026-12-31", status: "on-track" as const },
  { owner: "Feliciano Lukamba", title: "Precisão de inventário acima de 99%", progress: 88, due: "2026-12-31", status: "on-track" as const },
  { owner: "Kátia Sebastião", title: "Angariar 6 novos contratos de frete", progress: 33, due: "2026-12-31", status: "at-risk" as const },
  { owner: "Osvaldo Chipenda", title: "Concluir a migração do ERP", progress: 55, due: "2026-11-30", status: "at-risk" as const },
  { owner: "Isabel Neto", title: "Digitalizar 100% dos processos individuais", progress: 94, due: "2026-10-31", status: "on-track" as const },
];

export const nineBox = [
  { label: "Talento a desenvolver", count: 12 },
  { label: "Futuro líder", count: 9 },
  { label: "Estrela", count: 6 },
  { label: "Profissional em risco", count: 4 },
  { label: "Profissional sólido", count: 118 },
  { label: "Alto desempenho", count: 31 },
  { label: "Insuficiente", count: 3 },
  { label: "Eficaz", count: 52 },
  { label: "Especialista de confiança", count: 13 },
];

export const feedbackItems = [
  { from: "Domingos Cassoma", to: "Feliciano Lukamba", kind: "Reconhecimento", message: "Excelente coordenação na descarga do navio no fim-de-semana. Zero incidentes.", date: "2026-10-12", value: "Segurança" },
  { from: "Kátia Sebastião", to: "Nádia Paím", kind: "Reconhecimento", message: "A proposta para a conta Sonangol Logística ficou impecável.", date: "2026-10-10", value: "Foco no cliente" },
  { from: "Isabel Neto", to: "Edvânia Tavares", kind: "Sugestão", message: "Nas próximas admissões, valida o NIF antes de pedir o IBAN.", date: "2026-10-08", value: "Rigor" },
  { from: "Graça Mbemba", to: "Ana Mateus", kind: "Reconhecimento", message: "Fecho de contas do trimestre entregue dois dias antes do prazo.", date: "2026-10-03", value: "Rigor" },
];

export const trainings = [
  { title: "Condução defensiva de pesados", provider: "Escola de Condução Kifangondo", date: "2026-10-21", seats: 20, enrolled: 18, hours: 16, mandatory: true },
  { title: "Operação segura de empilhadoras", provider: "Mukuxi Consultoria", date: "2026-10-28", seats: 15, enrolled: 15, hours: 12, mandatory: true },
  { title: "Excel avançado para finanças", provider: "INEFOP", date: "2026-11-04", seats: 12, enrolled: 7, hours: 24, mandatory: false },
  { title: "Primeiros socorros", provider: "Cruz Vermelha de Angola", date: "2026-11-18", seats: 25, enrolled: 11, hours: 8, mandatory: true },
];

export const certificates = [
  { employee: "Lukeny Bamba", title: "Operação de empilhadoras", expires: "2026-11-02" },
  { employee: "Hélder Kiala", title: "Carta de condução — categoria C", expires: "2026-12-15" },
  { employee: "Manuel Kalandula", title: "Trabalhos em altura", expires: "2027-02-20" },
];
