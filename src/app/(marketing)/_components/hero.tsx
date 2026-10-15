import { Payslip } from "./payslip";
import { StartForm } from "./start-form";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b">
      <div className="mx-auto grid max-w-6xl gap-16 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:pb-28 lg:pt-20">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Recursos humanos e salários para empresas angolanas</p>
          <h1 id="hero-title" className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-6xl">
            A folha de pagamento certa, sem noites no Excel.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            O Pagador.ao calcula vencimentos, IRT e Segurança Social segundo a lei angolana, prepara o ficheiro para o seu banco e avisa-o antes de cada
            prazo da AGT e do INSS. Você revê e aprova.
          </p>

          <StartForm className="mt-9" />
          <p className="mt-3 text-sm text-muted-foreground">
            30 dias grátis, sem cartão.{" "}
            <a href="#o-problema" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
              Ou veja primeiro porquê
            </a>
          </p>
        </div>

        <Payslip />
      </div>
    </section>
  );
}
