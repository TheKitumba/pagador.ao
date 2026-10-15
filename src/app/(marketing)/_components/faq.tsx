import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { SectionHeading } from "./section-heading";

const questions = [
  {
    q: "Como acompanham as alterações à lei, como o OGE ou o salário mínimo?",
    a: "As taxas, os escalões do IRT, os subsídios e os feriados são parâmetros com data de vigência, não estão escritos no código. Quando a lei muda, actualizamos as tabelas e o processamento seguinte já as usa. Os meses anteriores continuam a ser calculados com as regras que estavam em vigor.",
  },
  {
    q: "Posso importar os trabalhadores que já tenho em Excel?",
    a: "Sim. Guarde a folha de cálculo em CSV e importe até 2 000 trabalhadores de uma vez. O sistema valida todas as linhas primeiro e mostra os erros para os corrigir antes de gravar.",
  },
  {
    q: "Que bancos são suportados para o pagamento dos salários?",
    a: "Geramos ficheiros de transferência em lote no formato de cada banco, entre eles BAI, BFA, BIC, BPC, Millennium Atlântico, Standard Bank, Banco Sol e Banco Keve, para carregar no internet banking empresarial. O IBAN de cada trabalhador é validado antes de gerar o ficheiro.",
  },
  {
    q: "Os trabalhadores precisam de instalar alguma aplicação?",
    a: "Não. O portal do trabalhador funciona no navegador do telemóvel, mesmo em telemóveis Android de gama baixa e com ligações lentas. Cada trabalhador vê os seus recibos, pede férias e actualiza os seus dados.",
  },
  {
    q: "Onde ficam alojados os dados da minha empresa?",
    a: "Os dados são tratados em conformidade com a Lei n.º 22/11, cifrados e com cópias de segurança diárias. Para grandes clientes com requisitos regulatórios próprios existe a opção de instalação dedicada.",
  },
  {
    q: "Como funciona o período experimental?",
    a: "Cria a conta da empresa, configura-a e processa salários durante 30 dias sem pagar nada e sem indicar cartão. No fim escolhe o plano que melhor se adapta à sua empresa.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="perguntas-title" id="perguntas" className="scroll-mt-20 border-t bg-card py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading id="perguntas-title" eyebrow="Perguntas frequentes" title="Ainda tem dúvidas?" className="text-left lg:mx-0" />
        <Accordion type="single" collapsible className="border-t">
          {questions.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="pr-8 text-[15px] leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
