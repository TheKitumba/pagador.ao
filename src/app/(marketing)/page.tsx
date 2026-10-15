import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

import { Audiences } from "./_components/audiences";
import { Faq } from "./_components/faq";
import { Features } from "./_components/features";
import { FinalCta } from "./_components/final-cta";
import { Hero } from "./_components/hero";
import { PayrollCycle } from "./_components/payroll-cycle";
import { Plans } from "./_components/plans";
import { Security } from "./_components/security";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} — Recursos humanos e folha de pagamento para empresas angolanas` },
  description:
    "Processe salários com o IRT e a Segurança Social correctos, pague por ficheiro bancário e entregue os mapas à AGT e ao INSS no prazo. 30 dias grátis.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <PayrollCycle />
      <Audiences />
      <Security />
      <Plans />
      <Faq />
      <FinalCta />
    </>
  );
}
