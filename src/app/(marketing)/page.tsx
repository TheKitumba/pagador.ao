import type { Metadata } from "next";

import { APP_NAME } from "@/config/app";

import { Faq } from "./_components/faq";
import { FinalCta } from "./_components/final-cta";
import { Hero } from "./_components/hero";
import { HiddenError } from "./_components/hidden-error";
import { Plans } from "./_components/plans";
import { Problem } from "./_components/problem";
import { Trust } from "./_components/trust";
import { WholeCompany } from "./_components/whole-company";
import { YourMonth } from "./_components/your-month";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} — Folha de pagamento e recursos humanos para empresas angolanas` },
  description:
    "Vencimentos, IRT e Segurança Social calculados segundo a lei angolana, ficheiros para o seu banco e avisos antes de cada prazo da AGT e do INSS. 30 dias grátis.",
};

/**
 * The page tells one story: the promise (hero), the pain (problem), the hidden cost (one real IRT
 * mistake, scaled to the reader), the new month, the rest of HR, trust, the offer, objections, and a
 * closing invitation to compare their own payroll.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Problem />
      <HiddenError />
      <YourMonth />
      <WholeCompany />
      <Trust />
      <Plans />
      <Faq />
      <FinalCta />
    </>
  );
}
