import { SectionHeading } from "./section-heading";

// Only safeguards implemented in api.pagador.ao today.
const safeguards = [
  { title: "Cada empresa isolada", detail: "A separação entre clientes é garantida pela própria base de dados, não só pela aplicação." },
  { title: "Autenticação em dois passos", detail: "Para quem tem acesso a salários e pagamentos." },
  { title: "Registo de auditoria", detail: "Quem criou, alterou ou aprovou cada valor, e quando. Não pode ser apagado." },
  { title: "Lei n.º 22/11", detail: "Consentimentos registados, dados sensíveis mascarados e acesso por perfil." },
];

export function Trust() {
  return (
    <section aria-labelledby="seguranca-title" id="seguranca" className="scroll-mt-16 border-y bg-card py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <SectionHeading id="seguranca-title" kicker="Segurança" title="Os salários são a informação mais sensível da sua empresa.">
          <p>Cada pessoa vê apenas o que o seu papel permite. O trabalhador vê o seu recibo. O auditor vê, mas não altera.</p>
        </SectionHeading>
        <dl className="border-t">
          {safeguards.map((item) => (
            <div key={item.title} className="grid gap-1 border-b py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="font-semibold">{item.title}</dt>
              <dd className="text-muted-foreground">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
