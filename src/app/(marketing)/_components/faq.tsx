import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { TwoTone } from "./primitives";

// Ordered by the objections a buyer actually raises.
const questions = [
  {
    q: "O nosso contabilista já trata dos salários. Porque mudar?",
    a: "Não precisa de deixar o contabilista. Dê-lhe um acesso de auditor: vê os mapas, os recibos e o registo de auditoria, mas não altera nada. Ele deixa de receber folhas de cálculo por e-mail e passa a validar números que já vêm certos.",
  },
  {
    q: "E quando a lei muda, com o OGE ou o salário mínimo?",
    a: "As taxas, os escalões do IRT, os limites de isenção e os feriados são tabelas com data de vigência. Quando a lei muda, a nova tabela aplica-se a partir da data certa e os meses anteriores continuam calculados com as regras do seu tempo.",
  },
  {
    q: "Quanto tempo leva a começar?",
    a: "Cria a conta e a empresa num formulário. Depois, um assistente pede os dados fiscais e da Segurança Social, a estrutura e os trabalhadores. Pode importar até 2 000 trabalhadores de uma vez a partir de um CSV da sua folha de cálculo; as linhas com erros são assinaladas antes de gravar.",
  },
  {
    q: "Posso testar com a folha deste mês, sem compromisso?",
    a: "Sim, é a melhor forma. Faça uma pré-folha no Pagador.ao e compare-a com a sua folha de cálculo. Durante 30 dias não paga nada e não indica cartão.",
  },
  {
    q: "Os trabalhadores precisam de instalar alguma aplicação?",
    a: "Não. O portal do trabalhador funciona no navegador do telemóvel, mesmo em telemóveis Android de gama baixa e com rede fraca.",
  },
  {
    q: "Que bancos são suportados?",
    a: "Geramos o ficheiro de transferências no formato de cada banco, entre eles BAI, BFA, BIC, BPC, Millennium Atlântico, Standard Bank, Banco Sol e Banco Keve. O IBAN de cada trabalhador é validado antes de gerar o ficheiro.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="perguntas-title" id="perguntas" className="scroll-mt-24 border-t border-white/[0.06] px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <TwoTone id="perguntas-title" lead="Perguntas." rest="O que nos perguntam antes de mudar." align="left" size="md" />
        <Accordion type="single" collapsible className="border-t border-white/[0.08]">
          {questions.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-white/[0.08]">
              <AccordionTrigger className="py-5 text-left text-base font-normal text-neutral-100 hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="pb-6 pr-8 text-[15px] leading-relaxed text-neutral-400">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
